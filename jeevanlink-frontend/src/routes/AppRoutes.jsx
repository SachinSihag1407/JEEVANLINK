import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/layout/ProtectedRoute.jsx";

// auth pages
import Login from "../pages/auth/Login.jsx";
import Register from "../pages/auth/Register.jsx";

// dashboards
import PatientDashboard from "../pages/patient/PatientDashboard.jsx";
import CreateEmergency from "../pages/patient/CreateEmergency";
import HospitalDashboard from "../pages/hospital/HospitalDashboard.jsx";
import AmbulanceDashboard from "../pages/ambulance/AmbulanceDashboard.jsx";
import AdminDashboard from "../pages/admin/AdminDashboard.jsx";

import NotFound from "../pages/NotFound.jsx";
import Home from "../pages/Home/Home.jsx";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Patient */}
      <Route
        path="/patient/*"
        element={
          <ProtectedRoute allowedRoles={["PATIENT"]}>
            <PatientDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/patient/create"
        element={
          <ProtectedRoute allowedRoles={["PATIENT"]}>
            <CreateEmergency />
          </ProtectedRoute>
        }
      />


      {/* Hospital */}
      <Route
        path="/hospital/*"
        element={
          <ProtectedRoute allowedRoles={["HOSPITAL"]}>
            <HospitalDashboard />
          </ProtectedRoute>
        }
      />

      {/* Ambulance */}
      <Route
        path="/ambulance/*"
        element={
          <ProtectedRoute allowedRoles={["AMBULANCE"]}>
            <AmbulanceDashboard />
          </ProtectedRoute>
        }
      />

      {/* Admin */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
