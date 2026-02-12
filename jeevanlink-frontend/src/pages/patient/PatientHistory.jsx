import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

const PatientHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get("/emergencies/my-history", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setHistory(res.data.emergencies);
    } catch (err) {
      console.log("History error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0C10] text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0C10] text-white p-6">

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">Emergency History</h1>

        <button
          onClick={() => navigate(-1)}
          className="text-blue-400 text-sm"
        >
          Back
        </button>
      </div>

      <div className="space-y-4">
        {history.map((item) => (
          <div
            key={item._id}
                onClick={() =>
                  navigate(`/patient/emergency/${item._id}`)
                }
            className="bg-[#1A1D23] p-5 rounded-2xl shadow-lg"
          >
            <p className="font-semibold text-sm">
              {item.emergencyType}
            </p>

            <p className="text-xs text-white/50">
              {new Date(item.createdAt).toLocaleString()}
            </p>

            <p className="text-xs mt-1">
              Status: {item.status}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PatientHistory;
