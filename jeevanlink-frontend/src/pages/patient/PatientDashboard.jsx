import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import LiveMap from "../../components/LiveMap";

const PatientDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [activeEmergency, setActiveEmergency] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // ================= FETCH DATA =================
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");

      const activeRes = await api.get("/emergencies/my-active", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const historyRes = await api.get("/emergencies/my-history", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setActiveEmergency(activeRes.data?.emergency || null);
      setHistory(historyRes.data?.emergencies || []);
    } catch (err) {
      console.log("Dashboard fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  // Auto refresh every 10 sec
  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  // ================= CANCEL =================
  const cancelEmergency = async () => {
    if (!activeEmergency?._id) return;

    try {
      const token = localStorage.getItem("token");

      await api.patch(
        `/emergencies/cancel/${activeEmergency._id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      fetchData();
    } catch (err) {
      console.log("Cancel failed");
    }
  };

  // ================= STATUS COLOR =================
  const getStatusColor = (status) => {
    switch (status) {
      case "CREATED":
        return "bg-yellow-500/20 text-yellow-400";
      case "ASSIGNED":
        return "bg-blue-500/20 text-blue-400";
      case "IN_TREATMENT":
        return "bg-purple-500/20 text-purple-400";
      case "CLOSED":
        return "bg-green-500/20 text-green-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-[#0A0C10]">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0C10] text-white">

      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-center px-6 py-4 border-b border-white/10">
        <h1 className="text-lg font-bold">
          Hello, {user?.name}
        </h1>

        <button
          onClick={() => {
            logout();
            navigate("/login");
          }}
          className="text-red-500 text-sm font-semibold"
        >
          Logout
        </button>
      </div>

      <div className="p-6 space-y-6">

        {/* ================= NO ACTIVE ================= */}
        {!activeEmergency && (
          <div className="bg-[#1A1D23] p-6 rounded-2xl shadow-xl">
            <h2 className="text-xl font-bold mb-3">
              Need Immediate Help?
            </h2>

            <p className="text-sm text-white/60 mb-4">
              Raise an emergency and nearby hospitals will be notified instantly.
            </p>

            <button
              onClick={() => navigate("/patient/create")}
              className="w-full bg-blue-600 hover:bg-blue-700 transition py-3 rounded-xl font-bold"
            >
              Request Emergency Help
            </button>
          </div>
        )}

        {/* ================= ACTIVE EMERGENCY ================= */}
        {activeEmergency && (
          <>
            {/* STATUS CARD */}
            <div
              onClick={() =>
                navigate(`/patient/emergency/${activeEmergency._id}`)
              }
              className="bg-[#1A1D23] p-6 rounded-2xl shadow-xl space-y-4 cursor-pointer hover:bg-[#20232b] transition"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold">
                  Emergency Status
                </h2>

                <span
                  className={`text-xs px-3 py-1 rounded-full font-semibold ${getStatusColor(
                    activeEmergency.status
                  )}`}
                >
                  {activeEmergency.status}
                </span>
              </div>

              {activeEmergency.hospital && (
                <p className="text-sm text-white/70">
                  Hospital: {activeEmergency.hospital.name}
                </p>
              )}

              {activeEmergency.ambulance && (
                <p className="text-sm text-white/70">
                  Ambulance: {activeEmergency.ambulance.name}
                </p>
              )}

              {activeEmergency.status === "CREATED" && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    cancelEmergency();
                  }}
                  className="bg-red-600 hover:bg-red-700 transition px-4 py-2 rounded-lg text-sm"
                >
                  Cancel Emergency
                </button>
              )}
            </div>

            {/* ================= LIVE MAP ================= */}
            {activeEmergency.location && (
              <LiveMap
                lat={activeEmergency.location.lat}
                lng={activeEmergency.location.lng}
                ambulanceLocation={activeEmergency.ambulanceLocation}
              />
            )}
          </>
        )}

        {/* ================= HISTORY ================= */}
        <div className="bg-[#1A1D23] p-6 rounded-2xl shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">
              Recent Emergencies
            </h2>

            <button
              onClick={() => navigate("/patient/history")}
              className="text-blue-400 text-xs font-semibold hover:underline"
            >
              View All
            </button>
          </div>

          {history.length === 0 && (
            <p className="text-sm text-white/50">
              No previous emergencies.
            </p>
          )}

          <div className="max-h-60 overflow-y-auto space-y-3 pr-1">
            {history.slice(0, 5).map((item) => (
              <div
                key={item._id}
                onClick={() =>
                  navigate(`/patient/emergency/${item._id}`)
                }
                className="bg-black/20 p-4 rounded-xl border border-white/5 cursor-pointer hover:bg-black/40 transition"
              >
                <div className="flex justify-between items-center">
                  <p className="text-sm font-semibold">
                    {item.emergencyType}
                  </p>

                  <span
                    className={`text-[10px] px-2 py-1 rounded-full ${getStatusColor(
                      item.status
                    )}`}
                  >
                    {item.status}
                  </span>
                </div>

                <p className="text-xs text-white/50 mt-1">
                  {new Date(item.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default PatientDashboard;
