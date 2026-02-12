import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

const Register = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const isFormFilled =
    name.trim() !== "" &&
    role !== "" &&
    email.trim() !== "" &&
    password.trim() !== "";

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/users/register", {
        name,
        role,
        email,
        password,
      });

      navigate("/login");
    } catch (err) {
      alert("Registration failed");
    }
  };

  return (
    <div className="bg-charcoal font-display text-white antialiased min-h-screen">
      <div className="flex flex-col min-h-screen w-full max-w-[430px] mx-auto bg-charcoal shadow-2xl relative overflow-hidden">

        {/* Top Bar */}
        <div className="flex items-center p-4 pb-2 justify-between sticky top-0 z-10 bg-charcoal/80 backdrop-blur-md">
          <div
            onClick={() => navigate(-1)}
            className="text-medical-blue flex size-10 shrink-0 items-center justify-center cursor-pointer"
          >
            <span className="material-symbols-outlined text-[28px] text-primary">
              arrow_back_ios
            </span>
          </div>
          <h2 className="text-white text-lg font-bold leading-tight tracking-widest uppercase flex-1 text-center pr-10">
            JEEVANLINK
          </h2>
        </div>

        {/* Title */}
        <div className="px-6 pt-6 pb-4 text-center">
          <h1 className="text-white tracking-tight text-[32px] font-bold leading-tight">
            Create Account
          </h1>
          <p className="text-gray-400 text-base font-normal leading-normal mt-1">
            Join our secure healthcare network
          </p>
        </div>

        {/* Form */}
        <div className="px-6 flex-1 flex flex-col">
          <form className="space-y-4" onSubmit={handleSubmit}>

            {/* Full Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-gray-300 text-sm font-semibold leading-normal ml-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="flex w-full rounded-xl text-white border-gray-700 bg-gray-800/50 focus:ring-2 focus:ring-medical-blue focus:border-medical-blue h-13 px-4 text-base font-normal leading-normal placeholder:text-gray-500"
              />
            </div>

            {/* Role */}
            <div className="flex flex-col gap-1.5">
              <label className="text-gray-300 text-sm font-semibold leading-normal ml-1">
                Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="flex w-full rounded-xl text-white border-gray-700 bg-gray-800/50 focus:ring-2 focus:ring-medical-blue focus:border-medical-blue h-13 px-4 text-base font-normal leading-normal"
              >
                <option value="">Select your role</option>
                <option value="PATIENT">PATIENT</option>
                <option value="HOSPITAL">HOSPITAL</option>
                <option value="AMBULANCE">AMBULANCE</option>
              </select>
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-gray-300 text-sm font-semibold leading-normal ml-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="flex w-full rounded-xl text-white border-gray-700 bg-gray-800/50 focus:ring-2 focus:ring-medical-blue focus:border-medical-blue h-13 px-4 text-base font-normal leading-normal placeholder:text-gray-500"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-gray-300 text-sm font-semibold leading-normal ml-1">
                Password
              </label>
              <div className="relative flex items-center">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  className="flex w-full rounded-xl text-white border-gray-700 bg-gray-800/50 focus:ring-2 focus:ring-medical-blue focus:border-medical-blue h-13 px-4 text-base font-normal leading-normal placeholder:text-gray-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 text-gray-400"
                >
                  <span className="material-symbols-outlined">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            {/* Info (conditional) */}
            {isFormFilled && (
              <div className="flex items-start gap-3 bg-medical-blue/10 p-4 rounded-xl border border-medical-blue/20 mt-2">
                <span className="material-symbols-outlined text-medical-blue text-[20px] mt-0.5">
                  info
                </span>
                <p className="text-gray-300 text-xs font-medium leading-relaxed">
                  Your account type will be assigned after verification.
                </p>
              </div>
            )}

            {/* Button */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-primary hover:bg-medical-blue/90 text-white font-bold py-4 rounded-xl shadow-lg shadow-medical-blue/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
              >
                <span>Create Account</span>
                <span className="material-symbols-outlined text-[20px]">
                  person_add
                </span>
              </button>
            </div>

          </form>
        </div>

        {/* Footer */}
        <div className="px-8 pt-8 pb-4 text-center mt-auto">
          <p className="text-gray-400 text-sm">
            Already have an account?
            <span
              onClick={() => navigate("/login")}
              className="text-primary font-bold hover:underline ml-1 cursor-pointer"
            >
              Login
            </span>
          </p>

          <div className="mt-6 flex justify-center items-center gap-4 opacity-50">
            <div className="h-[1px] w-12 bg-gray-700"></div>
            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mt-5">
              Secured by JEEVANLINK
            </div>
            <div className="h-[1px] w-12 bg-gray-700"></div>
          </div>
        </div>

        <div className="h-8 w-full flex justify-center items-end pb-2">
          <div className="h-[5px] w-[134px] bg-white/20 rounded-full"></div>
        </div>

      </div>
    </div>
  );
};

export default Register;
