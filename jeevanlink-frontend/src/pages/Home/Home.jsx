import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
 
const Home = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  // auto redirect if already logged in
  useEffect(() => {
    if (!loading && user) {
      if (user.role === "PATIENT") navigate("/patient");
      if (user.role === "HOSPITAL") navigate("/hospital");
      if (user.role === "AMBULANCE") navigate("/ambulance");
      if (user.role === "ADMIN") navigate("/admin");
    }
  }, [user, loading, navigate]);

  if (loading) return null;

  return (
    <div className="dark bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 antialiased">
      <div className="relative flex min-h-screen w-full flex-col justify-between overflow-x-hidden px-4 sm:px-6 py-8 sm:py-12 lg:py-20">

        {/* Header */}
        <header className="flex flex-col items-center justify-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/20">
            <span className="material-symbols-outlined text-4xl text-white">
              security
            </span>
          </div>
          <h1 className="text-2xl font-bold uppercase tracking-widest">
            JEEVANLINK
          </h1>
        </header>

        {/* Main */}
        <main className="flex flex-1 flex-col items-center justify-center text-center min-h-[50vh] sm:min-h-[55vh]">
          <div className="max-w-xs space-y-4">
            <div
              className="relative mx-auto mb-6 h-40 sm:h-44 md:h-48 w-full overflow-hidden rounded-xl bg-slate-200 dark:bg-slate-800"
              style={{
                backgroundImage:
                  'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCu60a_JX8MCteMFNXm67SpU05d3aVCW3KDUp1IjnG_KbY55aRCcXUEns5CjETK5502uAwA-cfc7T2KKvuUy3GNOgTAXomt0ygEmnmWwuPqbXi-ETJfIr0lqN1VSDh3lhT7hJt3ncfzj1nW3o7BQ6ZVbF37AvUrOSCmp9_0WCFYF6fMMasl_gawdGngYyNeUGJa_lxGeitm_4UWiocR9xOeqHk5Z04yt6Y0GFOZ2yj_q_6ER1VtpbVgR_e_9pPnMtH9NQ8XEtfTYU8")',
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-background-dark/80 to-transparent" />
            </div>

            <h2 className="text-2xl font-bold">
              Secure state-driven emergency management.
            </h2>

            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              A calm, focused environment for critical response and coordination.
            </p>
          </div>
        </main>

        {/* Footer */}
        <footer className="flex flex-col items-center space-y-3 sm:space-y-4 mt-4 sm:mt-6">
          <div className="w-full max-w-sm px-4">
            <button
              onClick={() => navigate("/login")}
              className="w-full h-14 rounded-lg bg-primary text-white text-lg font-bold transition-all active:scale-[0.98]"
            >
              Log In
            </button>
          </div>

          <div className="w-full max-w-sm px-4 flex flex-col items-center">
            <button
              onClick={() => navigate("/register")}
              className="text-base font-semibold text-slate-600 dark:text-slate-400"
            >
              Don&apos;t have an account?
              <span className="text-primary ml-1">Sign Up</span>
            </button>
          </div>
        </footer>

        {/* Background */}
        <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
          <div className="absolute -top-[10%] -left-[10%] h-[40%] w-[40%] rounded-full bg-primary/5 blur-[120px]" />
          <div className="absolute -bottom-[10%] -right-[10%] h-[40%] w-[40%] rounded-full bg-primary/5 blur-[120px]" />
        </div>

      </div>
    </div>
  );
};

export default Home;
