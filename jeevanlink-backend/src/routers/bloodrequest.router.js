import { Router } from "express";
import { authUser } from "../middlewares/auth.middleware.js";
import {
  createBloodRequest,
  getPendingBloodRequests,
  acceptBloodRequest,
} from "../controllers/bloodRequest.controller.js";

const bloodRequestRouter = Router();

bloodRequestRouter.post(
  "/create/:emergencyId",
  authUser,
  createBloodRequest
);

bloodRequestRouter.get(
  "/pending",
  authUser,
  getPendingBloodRequests
);

bloodRequestRouter.patch(
  "/accept/:requestId",
  authUser,
  acceptBloodRequest
);

export default bloodRequestRouter;
