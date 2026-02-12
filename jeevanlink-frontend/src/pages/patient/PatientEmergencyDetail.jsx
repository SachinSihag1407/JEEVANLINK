import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import LiveMap from "../../components/LiveMap";

const PatientEmergencyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [emergency, setEmergency] = useState(null);
  const [loading, setLoading] = useState(true);

  const steps = ["CREATED", "ASSIGNED", "IN_TREATMENT", "CLOSED"];

  const fetchEmergency = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get(`/emergencies/get/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setEmergency(res.data);
    } catch (err) {
      console.log("Fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmergency();
  }, [id]);

  const getStatusColor = (status) => {
    switch (status) {
      case "CREATED":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
      case "ASSIGNED":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "IN_TREATMENT":
        return "bg-purple-500/10 text-purple-400 border-purple-500/20";
      case "CLOSED":
        return "bg-green-500/10 text-green-400 border-green-500/20";
      default:
        return "";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0c] text-white">
        Loading...
      </div>
    );
  }

  if (!emergency) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0c] text-white">
        Emergency not found
      </div>
    );
  }

  const currentIndex = steps.indexOf(emergency.status);

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white px-4 pb-10">

      {/* HEADER */}
      <div className="flex items-center gap-4 py-6">
        <button
          onClick={() => navigate("/patient")}
          className="w-10 h-10 rounded-full bg-[#16161d] flex items-center justify-center"
        >
          ←
        </button>

        <div>
          <h1 className="text-lg font-bold">
            Emergency #{emergency._id.slice(-6)}
          </h1>
          <p className="text-xs text-white/40">
            JEEVANLINK Case
          </p>
        </div>
      </div>

      {/* OVERVIEW CARD */}
      <div className="bg-[#16161d] rounded-2xl p-6 border border-white/5 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-extrabold">
              {emergency.emergencyType}
            </h2>
            <p className="text-white/50 text-sm mt-1">
              Reported at {new Date(emergency.createdAt).toLocaleString()}
            </p>
          </div>

          <span
            className={`px-3 py-1 rounded-full text-[10px] font-bold border ${getStatusColor(
              emergency.status
            )}`}
          >
            {emergency.status}
          </span>
        </div>
      </div>

      {/* TIMELINE */}
      <div className="bg-[#16161d] rounded-2xl p-6 border border-white/5 mb-6">
        <h3 className="text-xs font-bold text-white/40 uppercase mb-6">
          Status Timeline
        </h3>

        <div className="flex justify-between items-center relative">
          <div className="absolute top-3 left-0 right-0 h-1 bg-white/10 rounded-full"></div>

          {steps.map((step, index) => (
            <div key={step} className="flex flex-col items-center z-10">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                  ${
                    index <= currentIndex
                      ? "bg-blue-600"
                      : "bg-gray-600"
                  }`}
              >
                {index <= currentIndex ? "✓" : ""}
              </div>

              <span
                className={`text-[9px] mt-2 ${
                  index <= currentIndex
                    ? "text-blue-400"
                    : "text-white/40"
                }`}
              >
                {step}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* PATIENT INFO */}
      <div className="bg-[#16161d] rounded-2xl p-6 border border-white/5 mb-6">
        <h3 className="text-sm font-bold mb-4">Patient Info</h3>

        <p className="text-sm text-white/70">
          Name: {emergency.patient?.name}
        </p>

        <p className="text-sm text-white/70">
          Contact: {emergency.patient?.email}
        </p>

        {emergency.bloodGroup && (
          <div className="mt-4 bg-blue-600/10 p-4 rounded-xl border border-blue-600/20">
            <p className="text-sm font-semibold">
              Blood Required: {emergency.bloodGroup}
            </p>

            {emergency.bloodUnits && (
              <p className="text-sm">
                Units: {emergency.bloodUnits}
              </p>
            )}
          </div>
        )}
      </div>

      {/* HOSPITAL & AMBULANCE */}
      <div className="bg-[#16161d] rounded-2xl p-6 border border-white/5 mb-6 space-y-4">
        {emergency.hospital && (
          <p className="text-sm">
            Hospital: {emergency.hospital.name}
          </p>
        )}

        {emergency.ambulance && (
          <p className="text-sm">
            Ambulance: {emergency.ambulance.name}
          </p>
        )}
      </div>

      {/* MAP */}
      {emergency.location?.lat && (
        <LiveMap
          lat={emergency.location.lat}
          lng={emergency.location.lng}
        />
      )}

      {/* NOTES */}
      {emergency.notes && (
        <div className="bg-[#16161d] rounded-2xl p-6 border border-white/5 mt-6">
          <h3 className="text-sm font-bold mb-2">
            Medical Notes
          </h3>
          <p className="text-sm text-white/60 italic">
            {emergency.notes}
          </p>
        </div>
      )}
    </div>
  );
};

export default PatientEmergencyDetail;
