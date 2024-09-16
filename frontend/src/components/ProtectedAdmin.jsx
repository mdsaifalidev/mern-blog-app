import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import Spinner from "./Spinner";

const ProtectedAdmin = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <Spinner />;
  }

  if (user && user.role === "admin") {
    return children;
  }

  return <Navigate to="/login" replace={true} />;
};

export default ProtectedAdmin;
