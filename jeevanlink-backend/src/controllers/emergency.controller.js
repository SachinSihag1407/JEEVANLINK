import { validationResult } from "express-validator";
import mongoose from "mongoose";
import {
    createEmergencyService,
    getEmergencyByIdService,
    updateEmergencyStatusService,
} from "../services/emergency.service.js";

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
        const { emergencyId } = req.params;

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
