import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Navigate, Link, useNavigate } from "react-router-dom";

const Login = () => {
  const { login, user } = useAuth();

  if (user) {
    return <Navigate to="/" />;
  }
  const [email, setEmail] =useState("");
  const [password,setPassword] =useState("");
  const [err, setErr] =useState("")
  
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
    setErr("Please fill all the fields");
    return;
  }
  try{
    await login({email, password});
    navigate("/");
  }
  catch(Error){
    console.log(Error.response.data.error);
    setErr(Error.response?.data?.error || "Login failed");
  }
    
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow w-80">
        <h2 className="text-xl font-bold mb-4 text-center">Login</h2>

        <input
          className="w-full border p-2 mb-3 rounded"
          placeholder="Email"
          onChange={(e)=>setEmail(e.target.value)} value={email}
        />

        <input
          className="w-full border p-2 mb-3 rounded"
          type="password"
          placeholder="Password"
          onChange={(e)=>setPassword(e.target.value)} value={password}
        />

        <button className="w-full bg-purple-500 text-white py-2 rounded">
          Login
        </button>

        <p className="text-sm mt-3 text-center">
          No account? <Link className="text-blue-600" to="/register">Register</Link>
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

export default Login;