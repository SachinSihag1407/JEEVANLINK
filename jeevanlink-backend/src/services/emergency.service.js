import { Emergency } from "../models/emergency.model.js";

/*-------------------------- Create Emergency Service-----------------------*/

export const createEmergencyService = async ({patientId,symptoms,location,emergencyType,bloodGroup,bloodUnits,}) => {
    // prevent multiple active emergencies
    const activeEmergency = await Emergency.findOne({
        patient: patientId,
        status: { $in: ["CREATED", "ASSIGNED", "IN_TREATMENT"] },
    });

    if (activeEmergency) {
        return {
            error: true,
            message: "Active emergency already exists",
            emergencyId: activeEmergency._id,
        };
    }

    const emergency = await Emergency.create({
        patient: patientId,
        symptoms,
        location,
        emergencyType: emergencyType || "OTHER",
        bloodGroup,
        bloodUnits,
    });

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


/*--------------------------Update Emergency Status Service--------------------*/

export const updateEmergencyStatusService = async ({ emergency, status,}) => {

    /// ye uske liye h like ki man lo accept ho gyi h to aage vala status kya hoga 
    const allowedTransitions = {
        CREATED: ["ASSIGNED"],
        ASSIGNED: ["IN_TREATMENT"],
        IN_TREATMENT: ["CLOSED"],
    };

    if (!allowedTransitions[emergency.status] || !allowedTransitions[emergency.status].includes(status)) {

        return {
            error: true,
            message: `Cannot change status from ${emergency.status} to ${status}`,
        };
    }

    emergency.status = status;

    if (status === "CLOSED") {
        emergency.closedAt = new Date();
    }

    await emergency.save();

    return {
        error: false,
        emergency,
    };
};
