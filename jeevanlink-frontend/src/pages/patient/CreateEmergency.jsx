// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import api from "../../api/axios";

// const CreateEmergency = () => {
//   const navigate = useNavigate();
//   const token = localStorage.getItem("token");

//   const [symptoms, setSymptoms] = useState("");
//   const [type, setType] = useState("OTHER");
//   const [severity, setSeverity] = useState("MEDIUM");
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       await api.post(
//         "/emergencies/create-emergency",
//         {
//           symptoms,
//           emergencyType: type,
//           severity,
//           location: {
//             lat: 28.6139,
//             lng: 77.209,
//             address: "Auto detected",
//           },
//         },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       navigate("/patient");
//     } catch (err) {
//       console.log("Create error", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-background-dark text-white p-6">
//       <h2 className="text-xl font-bold mb-6">
//         Create Emergency
//       </h2>

//       <form onSubmit={handleSubmit} className="space-y-5">

//         <div>
//           <label className="block text-sm mb-2">
//             Symptoms
//           </label>
//           <textarea
//             required
//             value={symptoms}
//             onChange={(e) => setSymptoms(e.target.value)}
//             className="w-full p-3 rounded-lg bg-card-dark border border-white/10"
//           />
//         </div>

//         <div>
//           <label className="block text-sm mb-2">
//             Emergency Type
//           </label>
//           <select
//             value={type}
//             onChange={(e) => setType(e.target.value)}
//             className="w-full p-3 rounded-lg bg-card-dark border border-white/10"
//           >
//             <option value="ACCIDENT">Accident</option>
//             <option value="CARDIAC">Cardiac</option>
//             <option value="BURN">Burn</option>
//             <option value="OTHER">Other</option>
//           </select>
//         </div>

//         <div>
//           <label className="block text-sm mb-2">
//             Severity
//           </label>
//           <select
//             value={severity}
//             onChange={(e) => setSeverity(e.target.value)}
//             className="w-full p-3 rounded-lg bg-card-dark border border-white/10"
//           >
//             <option value="LOW">Low</option>
//             <option value="MEDIUM">Medium</option>
//             <option value="HIGH">High</option>
//             <option value="CRITICAL">Critical</option>
//           </select>
//         </div>

//         <button
//           disabled={loading}
//           className="w-full bg-primary py-3 rounded-xl font-bold"
//         >
//           {loading ? "Creating..." : "Create Emergency"}
//         </button>

//       </form>
//     </div>
//   );
// };

// export default CreateEmergency;


import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

const CreateEmergency = () => {
  const navigate = useNavigate();

  const [emergencyType, setEmergencyType] = useState("");
  const [severity, setSeverity] = useState("MEDIUM");
  const [symptoms, setSymptoms] = useState("");
  const [address, setAddress] = useState("");
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [bloodRequired, setBloodRequired] = useState(false);
  const [bloodGroup, setBloodGroup] = useState("");
  const [bloodUnits, setBloodUnits] = useState(1);
  const [contactNumber, setContactNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(pos.coords.latitude);
        setLng(pos.coords.longitude);
      },
      () => setError("Unable to fetch location")
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!lat || !lng) {
      setError("Please detect your location");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const res = await api.post(
        "/emergencies/create-emergency",
        {
          emergencyType,
          severity,
          symptoms,
          bloodGroup: bloodRequired ? bloodGroup : null,
          bloodUnits: bloodRequired ? bloodUnits : null,
          location: {
            address,
            lat,
            lng,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { emergencyId } = res.data;

      navigate(`/patient/emergency/${emergencyId}`);
    } catch (err) {
      setError("Failed to create emergency");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dark text-white font-display">
      {/* Dropdown Fix */}
      <style>{`
        input, select, textarea {
          background-color: #1A1D23 !important;
          border-color: rgba(255,255,255,0.1) !important;
          color: white !important;
        }
        select option {
          background-color: #1A1D23 !important;
          color: white !important;
        }
      `}</style>

      <div className="relative flex min-h-screen w-full flex-col bg-background-dark overflow-x-hidden pb-32">

        <header className="overflow-y-auto top-0 z-50 flex flex-col item-center bg-background-dark/80 backdrop-blur-md border-b border-white/5 px-4 pt-6 pb-4">
          <h1 className="text-white text-xl font-extrabold tracking-tight">
            Emergency Assistance Request
          </h1>
          <p className="text-white/60 text-sm">
            Provide accurate details so we can dispatch help immediately.
          </p>
        </header>

        <main className="flex-1 px-4 py-6 space-y-8">

          <form onSubmit={handleSubmit} className="space-y-8">

            {/* Emergency Type */}
            <div>
              <label className="block text-sm font-bold text-white/90 mb-2">
                Emergency Type
              </label>
              <select
                value={emergencyType}
                onChange={(e) => setEmergencyType(e.target.value)}
                //  size={3} 
                className="w-full h-14 rounded-2xl px-4 appearance-none focus:ring-2 focus:ring-primary/50 transition-all"
              >
                <option value="">Select emergency type</option>
                <option value="ACCIDENT">Road Accident</option>
                <option value="CARDIAC">Cardiac Arrest</option>
                <option value="BURN">Severe Burn</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            {/* Severity */}
            <div>
              <label className="block text-sm font-bold text-white/90 mb-2">
                Severity Level
              </label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                className="w-full h-14 rounded-2xl px-4 appearance-none focus:ring-2 focus:ring-primary/50 transition-all"
              >
                <option value="CRITICAL">Critical</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>
            </div>

            {/* Symptoms */}
            <div>
              <label className="block text-sm font-bold text-white/90 mb-2">
                Describe the Situation
              </label>
              <textarea
                required
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                className="w-full rounded-2xl p-4 min-h-[120px] focus:ring-2 focus:ring-primary/50 transition-all"
                placeholder="Patient unconscious, heavy bleeding..."
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-bold text-white/90 mb-2">
                Full Address
              </label>
              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full h-12 rounded-xl px-4 text-sm"
                placeholder="House No, Street Name"
              />

              <button
                type="button"
                onClick={detectLocation}
                className="mt-3 px-4 py-2 bg-primary/20 border border-primary/30 rounded-xl text-sm"
              >
                Detect My Location
              </button>
            </div>

            {/* Blood Requirement Section */}
            <div className="space-y-3">

              {/* Toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-white">
                    Blood May Be Required?
                  </p>
                  <p className="text-[11px] text-white/40">
                    Enable only if you are aware that transfusion might be needed.
                  </p>
                </div>

                <input
                  type="checkbox"
                  checked={bloodRequired}
                  onChange={() => setBloodRequired(!bloodRequired)}
                  className="h-5 w-5 accent-blue-600"
                />
              </div>

              {/* Conditional Fields */}
              {bloodRequired && (
                <div className="space-y-2">

                  <div className="grid grid-cols-2 gap-4">

                    {/* Blood Group (Optional) */}
                    <select
                      value={bloodGroup}
                      onChange={(e) => setBloodGroup(e.target.value)}
                      className="h-12 rounded-xl px-3 text-sm bg-card-dark border border-white/10 text-white focus:ring-2 focus:ring-primary"
                    >
                      <option value="">Group (Optional)</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                    </select>

                    {/* Units (Optional) */}
                    <input
                      type="number"
                      min="1"
                      value={bloodUnits}
                      onChange={(e) => setBloodUnits(e.target.value)}
                      className="h-12 rounded-xl px-4 text-sm bg-card-dark border border-white/10 text-white focus:ring-2 focus:ring-primary"
                      placeholder="Units (Optional)"
                    />
                  </div>

                  <p className="text-[11px] text-white/40">
                    If unsure, leave blank. Medical team will assess requirement.
                  </p>

                </div>
              )}
            </div>


            {error && (
              <div className="text-red-400 text-sm bg-red-900/20 p-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-16 bg-primary rounded-2xl flex items-center justify-center gap-3 shadow-2xl shadow-primary/30 active:scale-[0.98] transition-all"
            >
              {loading ? "Dispatching..." : "Dispatch Emergency Response"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/patient")}
              className="w-full h-12 bg-white/5 rounded-2xl flex items-center justify-center active:bg-white/10 transition-colors"
            >
              <span className="text-white/60 text-sm font-bold">
                Cancel
              </span>
            </button>


          </form>

        </main>
      </div>
    </div>
  );
};

export default CreateEmergency;

