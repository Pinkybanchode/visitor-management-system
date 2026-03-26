import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-gray-800 text-white px-6 py-3 flex justify-between items-center">
      <h1 className="font-bold text-lg">Visitor Management System</h1>

      <div className="flex gap-4 items-center">

        {!user && <Link to="/appointment">Create Appointment</Link>}
        {!user && <Link to="/login">Login</Link>}
        {!user && <Link to="/register">Register</Link>}

        {user?.role === "employee" && (
          <>
            <Link to="/add-visitor">Add Visitor</Link>
            <Link to="/appointments">My Appointments</Link>
            <Link to="/visitors">My Visitors</Link>
          </>
        )}

        {user?.role === "security" && (
          <>
            <Link to="/approved-appointments">Approved Appointments</Link>
            <Link to="/active-passes">Active Passes</Link>
            <Link to="/create-pass">Walk In Pass</Link>
            <Link to="/scan">Scan</Link>
            <Link to="/logs">Logs</Link>
          </>
        )}
        { user?.role === "admin" && (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/logs">Logs</Link>
          </>
        )

        }
        {user && (
          <>
            <span className="text-sm text-gray-300">{user.name}</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 px-3 py-1 rounded"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;