import { Navigate } from "react-router-dom";
import getUserFromToken from "../Helpers/auth";

const HomeRedirect = () => {
    const user = getUserFromToken();

  if (!user) return <Navigate to="/login" />;
  switch (user.role) {
    case "admin":
      return <Navigate to="/dashboard" />;
    case "employee":
      return <Navigate to="/add-visitor" />;
    case "security":
      return <Navigate to="/active-passes" />;
    default:
      return <Navigate to="/login" />;
  }
};

export default HomeRedirect;