import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

const PatientDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [activeEmergency, setActiveEmergency] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔵 Fetch Dashboard Data
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");

      const activeRes = await api.get("/emergencies/my-active", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const historyRes = await api.get("/emergencies/my-history", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setActiveEmergency(activeRes.data.emergency);
      setHistory(historyRes.data.emergencies);
    } catch (err) {
      console.log("Dashboard fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 🔴 Cancel Emergency
  const cancelEmergency = async () => {
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

  // 🟢 Create Emergency (Basic)
  const raiseEmergency = async () => {
    try {
      const token = localStorage.getItem("token");

      await api.post(
        "/emergencies/create-emergency",
        {
          symptoms: "Emergency reported from dashboard",
          location: {
            lat: 28.6139,
            lng: 77.209,
          },
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      fetchData();
    } catch (err) {
      console.log("Create failed");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-background-dark">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-dark text-white">

      {/* Header */}
      <div className="flex justify-between items-center px-6 py-4 border-b border-white/10">
        <h1 className="text-lg font-bold">
          Welcome, {user?.name}
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

        {/* 🔵 If No Active Emergency */}
        {!activeEmergency && (
          <div className="bg-card-dark p-6 rounded-2xl shadow-xl">
            <h2 className="text-xl font-bold mb-3">
              Need Immediate Help?
            </h2>

            <p className="text-sm text-white/60 mb-4">
              Raise an emergency and nearby hospitals will be notified instantly.
            </p>

            <button
              onClick={() => navigate("/patient/create")}
              className="w-full bg-primary py-3 rounded-xl font-bold"
            >
              Request Emergency Help
            </button>
          </div>
        )}

        {/* 🔴 If Active Emergency Exists */}
        {activeEmergency && (
          <div className="bg-card-dark p-6 rounded-2xl shadow-xl">
            <h2 className="text-xl font-bold mb-4">
              Emergency Status
            </h2>

            <p className="mb-2">
              <span className="font-semibold">Status:</span>{" "}
              {activeEmergency.status}
            </p>

            {activeEmergency.hospital && (
              <p className="mb-2">
                <span className="font-semibold">Hospital:</span>{" "}
                {activeEmergency.hospital.name}
              </p>
            )}

            {activeEmergency.ambulance && (
              <p className="mb-2">
                <span className="font-semibold">Ambulance:</span>{" "}
                {activeEmergency.ambulance.name}
              </p>
            )}

            {activeEmergency.status === "CREATED" && (
              <button
                onClick={cancelEmergency}
                className="mt-4 bg-red-600 px-4 py-2 rounded-lg"
              >
                Cancel Emergency
              </button>
            )}
          </div>
        )}

        {/* 🟢 History */}
        <div className="bg-card-dark p-6 rounded-2xl shadow-xl">
          <h2 className="text-lg font-bold mb-4">
            Emergency History
          </h2>

          {history.length === 0 && (
            <p className="text-sm text-white/50">
              No previous emergencies.
            </p>
          )}

          {history.map((item) => (
            <div
              key={item._id}
              className="border-b border-white/10 py-3"
            >
              <p className="text-sm font-semibold">
                {item.emergencyType}
              </p>
              <p className="text-xs text-white/50">
                {new Date(item.createdAt).toLocaleString()}
              </p>
              <p className="text-xs">
                Status: {item.status}
              </p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default PatientDashboard;
