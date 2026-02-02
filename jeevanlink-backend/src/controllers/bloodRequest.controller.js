import {
  createBloodRequestService,
  getPendingBloodRequestsService,
  acceptBloodRequestService,
} from "../services/bloodRequest.service.js";

/*------------- Create Blood Request (internal use) -------------*/

export const createBloodRequest = async (req, res) => {
  const { emergencyId } = req.params;

  const result = await createBloodRequestService(emergencyId);

  if (result.error) {
    return res.status(400).json({ message: result.message });
  }

  res.status(201).json({
    message: "Blood request created",
    request: result.request,
  });
};


/*------------- Pending Blood Requests (Blood Bank) -------------*/

export const getPendingBloodRequests = async (req, res) => {
  if (req.user.role !== "BLOOD_BANK") {
    return res.status(403).json({ message: "Access denied" });
  }

  const requests = await getPendingBloodRequestsService();

  res.status(200).json({
    count: requests.length,
    requests,
  });
};


/*------------- Accept Blood Request -------------*/

export const acceptBloodRequest = async (req, res) => {
  const { requestId } = req.params;

  if (req.user.role !== "BLOOD_BANK") {
    return res.status(403).json({ message: "Access denied" });
  }

  const result = await acceptBloodRequestService({
    requestId,
    bloodBankId: req.user._id,
  });

  if (result.error) {
    return res.status(400).json({ message: result.message });
  }

  res.status(200).json({
    message: "Blood request accepted",
    request: result.request,
  });
};
