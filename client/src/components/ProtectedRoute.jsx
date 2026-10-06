import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const isLoggedIn =
    localStorage.getItem("adminLoggedIn") === "true";

  console.log("ProtectedRoute:", isLoggedIn);

  if (!isLoggedIn) {
    console.log("Redirecting to login...");
    return <Navigate to="/admin/login" replace />;
  }

  console.log("Opening Dashboard...");
  return children;
};

export default ProtectedRoute;