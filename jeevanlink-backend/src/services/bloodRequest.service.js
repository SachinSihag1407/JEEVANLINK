import { BloodRequest } from "../models/bloodRequest.model.js";
import { Emergency } from "../models/emergency.model.js";

/*--------------- Create Blood Request ----------------*/

export const createBloodRequestService = async (emergencyId) => {
  const emergency = await Emergency.findById(emergencyId);

  if (!emergency) {
    return { error: true, message: "Emergency not found" };
  }

  if (!emergency.bloodGroup || !emergency.bloodUnits) {
    return { error: true, message: "Blood not required for this emergency" };
  }

  const existingRequest = await BloodRequest.findOne({ emergency: emergencyId });
  
  if (existingRequest) {
    return { error: true, message: "Blood request already exists" };
  }

  const request = await BloodRequest.create({
    emergency: emergencyId,
    bloodGroup: emergency.bloodGroup,
    units: emergency.bloodUnits,
  });

  return { error: false, request };
};


/*--------------- Get Pending Blood Requests ----------------*/

export const getPendingBloodRequestsService = async () => {
  return BloodRequest.find({ status: "PENDING" })
    .populate("emergency")
    .sort({ createdAt: 1 });
};


/*--------------- Accept Blood Request ----------------*/

export const acceptBloodRequestService = async ({ requestId, bloodBankId }) => {
  const request = await BloodRequest.findOneAndUpdate(
    {
      _id: requestId,
      status: "PENDING",
    },
    {
      status: "ACCEPTED",
      bloodBank: bloodBankId,
    },
    { new: true }
  );

  if (!request) {
    return {
      error: true,
      message: "Blood request already handled",
    };
  }

  return { error: false, request };
};
