import { Router } from "express";
import { body } from "express-validator";
import {
    acceptEmergency,
    assignAmbulance,
    cancelEmergency,
    createEmergency,
    getAssignedEmergenciesForAmbulance,
    getEmergencyById,
    getPendingEmergencies,
    updateAmbulanceStatus,
    updateEmergencyStatus,
}  from "../controllers/emergency.controller.js";

import { authUser } from "../middlewares/auth.middleware.js";

const emergencyRouter = Router();

// CREATE EMERGENCY (PATIENT)
emergencyRouter.post(
    "/create-emergency",
    authUser,
    [
        body("symptoms").notEmpty().withMessage("Symptoms are required"),
        body("location.lat").isNumeric().withMessage("Latitude is required"),
        body("location.lng").isNumeric().withMessage("Longitude is required"),
    ],
    createEmergency
);

// GET EMERGENCY DETAILS
emergencyRouter.get(
    "/get/:emergencyId",
    authUser,
    getEmergencyById
);

// UPDATE EMERGENCY STATUS
emergencyRouter.patch(
    "/update-status/:emergencyId",
    authUser,
    [
        body("status")
            .isIn(["ASSIGNED", "IN_TREATMENT", "CLOSED"])
            .withMessage("Invalid status"),
    ],
    updateEmergencyStatus
);

emergencyRouter.patch(
    "/cancel/:emergencyId",
    authUser,
    cancelEmergency
);

emergencyRouter.patch(
  "/accept/:emergencyId",
  authUser,
  acceptEmergency
);


emergencyRouter.get(
  "/pending",
  authUser,
  getPendingEmergencies
);

emergencyRouter.get(
  "/assigned",
  authUser,
  getAssignedEmergenciesForAmbulance
);

emergencyRouter.patch(
  "/assign-ambulance/:emergencyId",
  authUser,
  assignAmbulance
);

emergencyRouter.patch(
  "/ambulance-status/:emergencyId",
  authUser,
  updateAmbulanceStatus
);
export default emergencyRouter;
