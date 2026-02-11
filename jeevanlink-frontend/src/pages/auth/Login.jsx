import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/users/login", {
        email,
        password,
      });

      const { token, user } = res.data;

      login(token, user);

      if (user.role === "PATIENT") navigate("/patient");
      if (user.role === "HOSPITAL") navigate("/hospital");
      if (user.role === "AMBULANCE") navigate("/ambulance");
      if (user.role === "ADMIN") navigate("/admin");
    } catch (err) {
      setError("Invalid credentials. Please check and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-[#192233] rounded-xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800">

        {/* Header */}
        <div className="pt-10 pb-6 flex flex-col items-center">
          <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-primary text-4xl">
              health_and_safety
            </span>
          </div>
          <h1 className="text-2xl font-bold dark:text-white">JEEVANLINK</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Secure Healthcare Portal
          </p>
        </div>

        {/* Form */}
        <div className="px-6 pb-10">
          <form className="space-y-5" onSubmit={handleSubmit}>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
                  person
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-[#111722] border border-gray-200 dark:border-[#324467] rounded-lg dark:text-white focus:ring-2 focus:ring-primary outline-none"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
                  lock
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-12 py-3 bg-gray-50 dark:bg-[#111722] border border-gray-200 dark:border-[#324467] rounded-lg dark:text-white focus:ring-2 focus:ring-primary outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-white"
                >
                  <span className="material-symbols-outlined text-xl">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 text-red-500 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg text-xs">
                <span className="material-symbols-outlined text-sm">error</span>
                {error}
              </div>
            )}

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3.5 rounded-lg transition flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
            >
              {loading ? "Authenticating..." : "Login"}
            </button>
          </form>

          {/* Bottom */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Don&apos;t have an account?{" "}
              <span
                onClick={() => navigate("/register")}
                className="text-primary font-bold cursor-pointer hover:underline"
              >
                Sign Up
              </span>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 dark:bg-[#111722]/50 px-6 py-4 flex items-center justify-center gap-2 border-t border-gray-100 dark:border-[#324467]">
          <span className="material-symbols-outlined text-gray-400 text-sm">
            verified_user
          </span>
          <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">
            Securely Encrypted Session
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;
