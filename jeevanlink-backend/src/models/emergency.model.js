import mongoose,{Schema} from "mongoose";

const emergencySchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    hospital: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    ambulance: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    symptoms: {
      type: String,
      required: true,
    },

    emergencyType: {
      type: String,
      enum: ["ACCIDENT", "CARDIAC", "BURN", "OTHER"],
      default: "OTHER",
    },

    severity: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
      default: "MEDIUM",
    },

    bloodGroup: String,
    bloodUnits: Number,

    location: {
      address: String,
      lat: Number,
      lng: Number,
    },

    status: {
      type: String,
      enum: ["CREATED", "ASSIGNED", "IN_TREATMENT", "CLOSED"],
      default: "CREATED",
    },

    notes: String,
    closedAt: Date,
  },
  { timestamps: true }
);

export const Emergency = mongoose.model("Emergency", emergencySchema);
