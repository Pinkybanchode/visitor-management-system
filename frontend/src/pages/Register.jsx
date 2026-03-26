import { useState } from "react";
import API from "../api/axios";
import { useNavigate, Link } from "react-router-dom";


const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("employee");
  const [err, setErr] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name,
      email,
      password,
      role: role.toLowerCase()
    }
    if (!name || !email || !password) {
      setErr("Please fill all the fields");
      return;
    }
    try {
      await API.post("/auth/register", payload);
      alert("Registered!");
      navigate("/");
    }
    catch (Error) {
      setErr(Error.response?.data?.error || "Registration failed");
    }


  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form className="bg-white p-6 rounded shadow w-80" onSubmit={handleSubmit}>
        <h2 className="text-xl font-bold mb-4 text-center">Register</h2>

        <input className="w-full border p-2 mb-2 rounded" placeholder="Name" onChange={(e) => { setName(e.target.value);setErr(""); }} value={name} />
        <input className="w-full border p-2 mb-2 rounded" placeholder="Email" onChange={(e) => { setEmail(e.target.value);setErr(""); }} value={email} />
        <input className="w-full border p-2 mb-2 rounded" type="password" placeholder="Password" onChange={(e) => { setPassword(e.target.value) ;setErr("");}} value={password} />

        <select className="w-full border p-2 mb-3 rounded" onChange={(e) => { setRole(e.target.value) }} value={role} >
          <option>Employee</option>
          <option>Security</option>
          <option>Admin</option>
        </select>

        <button className="w-full bg-purple-500 text-white py-2 rounded">
          Register
        </button>
        <p className="text-sm mt-3 text-center">
          Have an Account? <Link className="text-blue-600" to="/">Login</Link>
        </p>
        {err && (
          <p className="text-red-500 mb-2 text-center">
            {err}
          </p>
        )}
      </form>
    </div>
  );
};

export default Register;