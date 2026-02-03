import { Emergency } from "../models/emergency.model.js";
import redis from "../config/redis.js";

/*-------------------------- Create Emergency Service-----------------------*/

export const createEmergencyService = async ({
  patientId,
  symptoms,
  location,
  emergencyType,
  bloodGroup,
  bloodUnits,
}) => {
  // ---------------- SAFETY CLEANUP (stale emergencies) ----------------
  const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);

  await Emergency.updateMany(
    {
      patient: patientId,
      status: "CREATED",
      createdAt: { $lt: tenMinutesAgo },
    },
    {
      status: "CLOSED",
      closedAt: new Date(),
    }
  );

  // clear any stale redis lock
  await redis.del(`active_emergency:${patientId}`);

  // ---------------- REDIS CHECK ----------------
  const cachedEmergencyId = await redis.get(
    `active_emergency:${patientId}`
  );

  if (cachedEmergencyId) {
    return {
      error: true,
      message: "Active emergency already exists",
      emergencyId: cachedEmergencyId,
    };
  }

  // ---------------- DB FALLBACK ----------------
  const activeEmergency = await Emergency.findOne({
    patient: patientId,
    status: { $in: ["CREATED", "ASSIGNED", "IN_TREATMENT"] },
  });

  if (activeEmergency) {
    await redis.set(
      `active_emergency:${patientId}`,
      activeEmergency._id.toString(),
      "EX",
      600 // 10 minutes TTL
    );

    return {
      error: true,
      message: "Active emergency already exists",
      emergencyId: activeEmergency._id,
    };
  }

  // ---------------- CREATE EMERGENCY ----------------
  const emergency = await Emergency.create({
    patient: patientId,
    symptoms,
    location,
    emergencyType: emergencyType || "OTHER",
    bloodGroup,
    bloodUnits,
  });

  // ---------------- SET REDIS LOCK WITH TTL ----------------
  await redis.set(
    `active_emergency:${patientId}`,
    emergency._id.toString(),
    "EX",
    600 // 10 minutes
  );

  return {
    error: false,
    emergency,
  };
};


/*------------------ Get Emergency By ID Service-----------------------*/

export const getEmergencyByIdService = async (emergencyId) => {
  return Emergency.findById(emergencyId)
    .populate("patient", "name role")
    .populate("hospital", "name role")
    .populate("ambulance", "name role");
};

/*-------------------------- Update Emergency Status Service --------------------*/

export const updateEmergencyStatusService = async ({ emergency, status }) => {
  const allowedTransitions = {
    CREATED: ["ASSIGNED"],
    ASSIGNED: ["IN_TREATMENT"],
    IN_TREATMENT: ["CLOSED"],
  };

  if (
    !allowedTransitions[emergency.status] ||
    !allowedTransitions[emergency.status].includes(status)
  ) {
    return {
      error: true,
      message: `Cannot change status from ${emergency.status} to ${status}`,
    };
  }

  emergency.status = status;

  if (status === "CLOSED") {
    emergency.closedAt = new Date();

    //  REMOVE REDIS LOCK
    await redis.del(`active_emergency:${emergency.patient.toString()}`);
  }

  await emergency.save();

  return {
    error: false,
    emergency,
  };
};


/*-------------------- Cancel Emergency Service --------------------*/

export const cancelEmergencyService = async ({ emergency, userId }) => {
  if (emergency.status !== "CREATED") {
    return {
      error: true,
      message: "Emergency cannot be cancelled now",
    };
  }

  // only patient can cancel
  if (emergency.patient.toString() !== userId.toString()) {
    return {
      error: true,
      message: "Not allowed",
    };
  }

  emergency.status = "CLOSED";
  emergency.closedAt = new Date();

  await emergency.save();

  // clear redis
  await redis.del(
    `active_emergency:${emergency.patient.toString()}`
  );

  return {
    error: false,
    emergency,
  };
};



/*-------------------- Hospital Accept Emergency Service --------------------*/

export const acceptEmergencyService = async ({ emergencyId, hospitalId }) => {
  // atomic update to avoid race condition
  const updatedEmergency = await Emergency.findOneAndUpdate(
    {
      _id: emergencyId,
      status: "CREATED", // only CREATED can be accepted
    },
    {
      status: "ASSIGNED",
      hospital: hospitalId,
    },
    {
      new: true,
    }
  );

  if (!updatedEmergency) {
    return {
      error: true,
      message: "Emergency already assigned or closed",
    };
  }

  return {
    error: false,
    emergency: updatedEmergency,
  };
};



/*-------------------- Get Pending Emergencies For Hospital --------------------*/

export const getPendingEmergenciesService = async () => {
  const emergencies = await Emergency.find({
    status: "CREATED",
  })
    .populate("patient", "name")
    .sort({ createdAt: 1 }); // oldest first

  return emergencies;
};



/*-------------------- Get Assigned Emergencies For Ambulance --------------------*/

export const getAssignedEmergenciesForAmbulanceService = async () => {
  return Emergency.find({
    status: "ASSIGNED",
    ambulance: null,
  })
    .populate("patient", "name")
    .populate("hospital", "name")
    .sort({ createdAt: 1 });
};


/*-------------------- Assign Ambulance To Emergency --------------------*/

export const assignAmbulanceService = async ({ emergencyId, ambulanceId }) => {
  // check if ambulance already busy
  const activeTrip = await Emergency.findOne({
    ambulance: ambulanceId,
    status: { $in: ["IN_TREATMENT"] },
  });

  if (activeTrip) {
    return {
      error: true,
      message: "Ambulance already on an active trip",
    };
  }

  // atomic assignment
  const updatedEmergency = await Emergency.findOneAndUpdate(
    {
      _id: emergencyId,
      status: "ASSIGNED",
      ambulance: null,
    },
    {
      ambulance: ambulanceId,
      status: "IN_TREATMENT",
    },
    { new: true }
  );

  if (!updatedEmergency) {
    return {
      error: true,
      message: "Emergency already taken or invalid state",
    };
  }

  return {
    error: false,
    emergency: updatedEmergency,
  };
};


/*-------------------- Update Ambulance Trip Status --------------------*/

export const updateAmbulanceStatusService = async ({
  emergency,
  status,
}) => {
  const allowedTransitions = {
    IN_TREATMENT: ["ON_THE_WAY"],
    ON_THE_WAY: ["PICKED_UP"],
    PICKED_UP: ["COMPLETED"],
  };

  if (
    !allowedTransitions[emergency.status] ||
    !allowedTransitions[emergency.status].includes(status)
  ) {
    return {
      error: true,
      message: "Invalid ambulance status transition",
    };
  }

  emergency.status = status;

  if (status === "COMPLETED") {
    emergency.closedAt = new Date();
  }

  await emergency.save();

  return {
    error: false,
    emergency,
  };
};
