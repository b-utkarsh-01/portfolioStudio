import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../features/auth/AuthContext";
import LoadingState from "../layout/LoadingState";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingState title="Checking session..." subtitle="Verifying your sign-in status." compact />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace state={{ from: location }} />;
  }

  return children;
};

export default ProtectedRoute;
