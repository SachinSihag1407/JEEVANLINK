import { validationResult } from "express-validator";
import mongoose from "mongoose";
import {
    acceptEmergencyService,
    assignAmbulanceService,
    cancelEmergencyService,
    createEmergencyService,
    getAssignedEmergenciesForAmbulanceService,
    getEmergencyByIdService,
    getPendingEmergenciesService,
    updateAmbulanceStatusService,
    updateEmergencyStatusService,
} from "../services/emergency.service.js";
import { Emergency } from "../models/emergency.model.js";
import { createBloodRequestService } from "../services/bloodRequest.service.js";



/*---------------------------- CREATE EMERGENCY--------------------------*/

export const createEmergency = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        if (req.user.role !== "PATIENT") {
            return res.status(403).json({ message: "Only patient can create emergency" });
        }

        const result = await createEmergencyService({
            patientId: req.user._id,
            ...req.body,
        });

        if (result.error) {
            return res.status(409).json(result);
        }

        return res.status(201).json({
            emergencyId: result.emergency._id,
            status: result.emergency.status,
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};


/*------------------------------GET EMERGENCY BY ID---------------------------------*/

export const getEmergencyById = async (req, res) => {
    try {
        const { emergencyId } = req.params;    // use for read the value from given url

        if (!mongoose.Types.ObjectId.isValid(emergencyId)) {
            return res.status(400).json({ message: "Invalid emergency ID" });
        }

        const emergency = await getEmergencyByIdService(emergencyId);

        if (!emergency) {
            return res.status(404).json({ message: "Emergency not found" });
        }

        const userId = req.user._id.toString();
        const role = req.user.role;

        const allowed =
            role === "ADMIN" ||
            emergency.patient?._id?.toString() === userId ||
            emergency.hospital?._id?.toString() === userId ||
            emergency.ambulance?._id?.toString() === userId;

        if (!allowed) {
            return res.status(403).json({ message: "Access denied" });
        }

        return res.status(200).json(emergency);
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};



/*-------------------------------- UPDATE EMERGENCY STATUS-------------------------------*/

export const updateEmergencyStatus = async (req, res) => {
    try {
        const { emergencyId } = req.params;
        const { status } = req.body;

        if (!["HOSPITAL", "ADMIN"].includes(req.user.role)) {
            return res.status(403).json({ message: "Not allowed" });
        }

        const emergency = await getEmergencyByIdService(emergencyId);
        if (!emergency) {
            return res.status(404).json({ message: "Emergency not found" });
        }

        const result = await updateEmergencyStatusService({
            emergency,
            status,
        });

        if (result.error) {
            return res.status(400).json({ message: result.message });
        }

        return res.status(200).json({
            message: "Status updated",
            status: result.emergency.status,
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};


export const cancelEmergency = async (req, res) => {
    const { emergencyId } = req.params;

    const emergency = await Emergency.findById(emergencyId);
    if (!emergency) {
        return res.status(404).json({ message: "Emergency not found" });
    }

    const result = await cancelEmergencyService({
        emergency,
        userId: req.user._id,
    });

    if (result.error) {
        return res.status(400).json({ message: result.message });
    }

    res.status(200).json({
        message: "Emergency cancelled successfully",
        emergency: result.emergency,
    });
};

/*-------------------------------- accept emergency------------------------------*/

export const acceptEmergency = async (req, res) => {
  const { emergencyId } = req.params;

  // role check
  if (req.user.role !== "HOSPITAL") {
    return res
      .status(403)
      .json({ message: "Only hospitals can accept emergencies" });
  }

  const emergency = await Emergency.findById(emergencyId);

  if (!emergency) {
    return res.status(404).json({ message: "Emergency not found" });
  }

  if (emergency.status === "CLOSED") {
    return res.status(400).json({ message: "Emergency already closed" });
  }

  // ✅ IDENTITY CASE (same hospital again)
  if (
    emergency.hospital &&
    emergency.hospital.toString() === req.user._id.toString()
  ) {
    // ENSURE BLOOD REQUEST EXISTS
    if (emergency.bloodGroup && emergency.bloodUnits) {
      await createBloodRequestService(emergency._id);
    }

    return res.status(200).json({
      message: "Emergency already accepted by this hospital",
      emergency,
    });
  }

  // NORMAL ACCEPT FLOW
  const result = await acceptEmergencyService({
    emergencyId,
    hospitalId: req.user._id,
  });

  if (result.error) {
    return res.status(400).json({ message: result.message });
  }

  // AUTO CREATE BLOOD REQUEST (TEMP DESIGN)
  if (result.emergency.bloodGroup && result.emergency.bloodUnits) {
    await createBloodRequestService(result.emergency._id);
  }

  return res.status(200).json({
    message: "Emergency accepted successfully",
    emergency: result.emergency,
  });
};


/*-------------------- get pending status -----------------------------*/

export const getPendingEmergencies = async (req, res) => {
    // role check
    if (req.user.role !== "HOSPITAL") {
        return res
            .status(403)
            .json({ message: "Only hospitals can view pending emergencies" });
    }

    const emergencies = await getPendingEmergenciesService();

    res.status(200).json({
        count: emergencies.length,
        emergencies,
    });
};



/*-------------------- Get Assigned Emergencies (Ambulance) --------------------*/

export const getAssignedEmergenciesForAmbulance = async (req, res) => {
    if (req.user.role !== "AMBULANCE") {
        return res
            .status(403)
            .json({ message: "Only ambulances can access this" });
    }

    const emergencies = await getAssignedEmergenciesForAmbulanceService();

    res.status(200).json({
        count: emergencies.length,
        emergencies,
    });
};


/*-------------------- Assign Ambulance --------------------*/

export const assignAmbulance = async (req, res) => {
    const { emergencyId } = req.params;

    if (req.user.role !== "AMBULANCE") {
        return res
            .status(403)
            .json({ message: "Only ambulances can accept trips" });
    }

    const result = await assignAmbulanceService({
        emergencyId,
        ambulanceId: req.user._id,
    });

    if (result.error) {
        return res.status(400).json({ message: result.message });
    }

    res.status(200).json({
        message: "Ambulance assigned successfully",
        emergency: result.emergency,
    });
};


/*-------------------- Update Ambulance Status --------------------*/

export const updateAmbulanceStatus = async (req, res) => {
    const { emergencyId } = req.params;
    const { status } = req.body;

    if (req.user.role !== "AMBULANCE") {
        return res
            .status(403)
            .json({ message: "Only ambulances can update status" });
    }

    const emergency = await Emergency.findById(emergencyId);

    if (!emergency) {
        return res.status(404).json({ message: "Emergency not found" });
    }

    if (
        !emergency.ambulance ||
        emergency.ambulance.toString() !== req.user._id.toString()
    ) {
        return res.status(403).json({ message: "Not assigned to this ambulance" });
    }

    const result = await updateAmbulanceStatusService({
        emergency,
        status,
    });

    if (result.error) {
        return res.status(400).json({ message: result.message });
    }

    res.status(200).json({
        message: "Ambulance status updated",
        emergency: result.emergency,
    });
};
