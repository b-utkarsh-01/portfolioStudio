import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../features/auth/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="mx-auto max-w-4xl py-20 text-center text-slate-300">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace state={{ from: location }} />;
  }

  return children;
};

export default ProtectedRoute;
