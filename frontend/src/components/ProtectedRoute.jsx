import { Navigate, useLocation } from "react-router-dom";
import { auth } from "../firebase";

function ProtectedRoute({ children, allowedRole }) {
  const user = auth.currentUser;
  const location = useLocation();

  // 🔐 Not logged in → go to login
  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  // 🔑 Get role from localStorage (set after backend login)
  const role = localStorage.getItem("role");

  // 🚫 No role found → force logout
  if (!role) {
    return <Navigate to="/login" replace />;
  }

  // 🚫 Role mismatch → redirect to home
  if (allowedRole && role !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
