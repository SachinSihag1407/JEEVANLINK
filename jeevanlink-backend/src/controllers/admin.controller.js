import { Emergency } from "../models/emergency.model.js";
import { User } from "../models/user.model.js";
import redis from "../config/redis.js";
import { AuditLog } from "../models/auditLog.model.js";

/* GET all emergencies */
export const getAllEmergencies = async (req, res) => {
    const data = await Emergency.find().sort({ createdAt: -1 });
    res.json(data);
};

/* FORCE CANCEL emergency */
export const forceCancelEmergency = async (req, res) => {
    const emergency = await Emergency.findById(req.params.id);

    if (!emergency) {
        return res.status(404).json({ message: "Emergency not found" });
    }

    if (emergency.status === "CLOSED") {
        return res.status(400).json({ message: "Already closed" });
    }

    emergency.status = "CANCELLED_BY_ADMIN";
    emergency.adminCancelledBy = req.user._id;
    emergency.adminCancelledAt = new Date();
    emergency.closedAt = new Date();

    await emergency.save();

    await AuditLog.create({
        action: "CANCEL_EMERGENCY",
        performedBy: req.user._id,
        targetType: "EMERGENCY",
        targetId: emergency._id,
        message: "Emergency cancelled by admin"
    });

    await redis.del(`active_emergency:${emergency._id}`);

    res.json({ message: "Emergency cancelled by admin" });

};

/* GET all users */
export const getAllUsers = async (req, res) => {
    const users = await User.find({
        role: { $ne: "ADMIN" }
    }).select("-password");

    res.json(users);
};

/* BLOCK user */
export const blockUser = async (req, res) => {
    if (req.user._id.toString() === req.params.id) {
        return res.status(400).json({ message: "Admin cannot block himself" });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    if (user.role === "ADMIN") {
        return res.status(400).json({ message: "Admin cannot be blocked" });
    }

    user.isBlocked = true;
    await user.save();

    await AuditLog.create({
        action: "BLOCK_USER",
        performedBy: req.user._id,
        targetType: "USER",
        targetId: user._id,
        message: "User blocked by admin"
    });

    res.json({ message: "User blocked" });

};

/* UNBLOCK user */
export const unblockUser = async (req, res) => {
    await User.findByIdAndUpdate(req.params.id, { isBlocked: false });

    await AuditLog.create({
        action: "UNBLOCK_USER",
        performedBy: req.user._id,
        targetType: "USER",
        targetId: req.params.id,
        message: "User unblocked by admin"
    });

    res.json({ message: "User unblocked" });

};

/* Get Audit Logs */

export const getAuditLogs = async (req, res) => {
  const logs = await AuditLog.find()
    .sort({ createdAt: -1 })
    .limit(100)
    .populate("performedBy", "name email role");

  res.json(logs);
};


/*-----------------------  get all stats--------------------*/

export const getAdminStats = async (req, res) => {
  const [
    totalEmergencies,
    activeEmergencies,
    closedEmergencies,
    cancelledByAdmin,
    totalUsers,
    patients,
    hospitals,
    ambulances,
    bloodBanks
  ] = await Promise.all([
    Emergency.countDocuments(),
    Emergency.countDocuments({ status: { $in: ["CREATED", "ASSIGNED", "IN_TREATMENT"] } }),
    Emergency.countDocuments({ status: "CLOSED" }),
    Emergency.countDocuments({ status: "CANCELLED_BY_ADMIN" }),

    User.countDocuments(),
    User.countDocuments({ role: "PATIENT" }),
    User.countDocuments({ role: "HOSPITAL" }),
    User.countDocuments({ role: "AMBULANCE" }),
    User.countDocuments({ role: "BLOOD_BANK" })
  ]);

  res.json({
    emergencies: {
      total: totalEmergencies,
      active: activeEmergencies,
      closed: closedEmergencies,
      cancelledByAdmin
    },
    users: {
      total: totalUsers,
      patients,
      hospitals,
      ambulances,
      bloodBanks
    }
  });
};

