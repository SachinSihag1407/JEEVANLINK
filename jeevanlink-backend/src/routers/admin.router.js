import express from "express";
import { authUser } from "../middlewares/auth.middleware.js";
import { allowRoles } from "../middlewares/role.middleware.js";
import {
    getAllEmergencies,
    forceCancelEmergency,
    getAllUsers,
    blockUser,
    unblockUser,
    getAuditLogs,
    getAdminStats
} from "../controllers/admin.controller.js";

const adminRouter = express.Router();

adminRouter.use(authUser);
adminRouter.use(allowRoles(["ADMIN"]));

adminRouter.get("/emergencies", getAllEmergencies);
adminRouter.patch("/emergencies/:id/cancel", forceCancelEmergency);

adminRouter.get("/users", getAllUsers);
adminRouter.patch("/users/:id/block", blockUser);
adminRouter.patch("/users/:id/unblock", unblockUser);

adminRouter.get("/audit-logs", getAuditLogs);

adminRouter.get("/stats", getAdminStats);



export default adminRouter;
