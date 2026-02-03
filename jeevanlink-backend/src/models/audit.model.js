import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true
    },

    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    targetType: {
      type: String,
      enum: ["USER", "EMERGENCY"],
      required: true
    },

    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },

    message: {
      type: String
    }
  },
  { timestamps: true }
);

export const AuditLog = mongoose.model("AuditLog", auditLogSchema);
