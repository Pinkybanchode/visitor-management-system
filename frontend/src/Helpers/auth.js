import { jwtDecode } from "jwt-decode";

const getUserFromToken = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);

    if (decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem("token");
      return null;
    }

    return {
      id: decoded.id || decoded._id,
      role: decoded.role
    };
  } catch {
    localStorage.removeItem("token");
    return null;
  }
};

export default getUserFromToken;