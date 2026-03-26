import { useEffect, useState } from "react";
import API from "../api/axios";

const ActivePasses = () => {
  const [passes, setPasses] = useState([]);
  const [loading, setLoading] = useState(true);
  //const backend_URI = `http://localhost:4000`;
  const backend_URI = `https://visitor-management-system-i849.onrender.com`
  const fetchActivePasses = async () => {
    try {
      const res = await API.get("/passes/all");
      setPasses(res.data.data || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivePasses();
  }, []);

  const formatDate = (date) =>
    new Date(date).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Active Passes</h2>

      {passes.length === 0 ? (
        <p>No active passes</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {passes.map((p) => (
            <div key={p._id} className="bg-white rounded-xl shadow-lg p-4 border w-[320px]">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-blue-600">Visitor Pass</h3>
                <span
                  className={`text-xs px-2 py-1 rounded ${p.status !== "approved" ? p.status !== "rejected" ?
                    "text-gray-600" : "text-red-600" : "text-green-600"
                    }`}>
                  {p.status}
                </span>
              </div>

              <div className="flex justify-center mb-3">
                <img
                  src={
                    p.visitorId?.photo
                      ? `${backend_URI}/uploads/${p.visitorId.photo}`
                      : "/default-avatar.png"
                  } alt="visitor" className="w-24 h-24 rounded-full object-cover border-2"
                />
              </div>

              <div className="text-center">
                <p className="font-semibold text-lg">
                  {p.visitorId?.name}
                </p>
                <p className="text-sm text-gray-500">
                  {p.visitorId?.email}
                </p>
              </div>

              <div className="mt-3 text-sm text-gray-700">
                <p>
                  <span className="font-medium mr-2">Host:</span>
                  {p.hostId?.name}
                </p>
                <p>
                  <span className="font-medium mr-2">Email:</span>
                  {p.hostId?.email}
                </p>
              </div>
              <div className="mt-2 text-center">
                <span
                  className={`px-3 py-1 rounded text-sm ${p.visitStatus === "checked-in"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-600"
                    }`}
                >
                  {p.visitStatus || "not-arrived"}
                </span>
              </div>

              <div className="mt-3 text-xs text-gray-500 text-center">
                <p>Valid From:<span className="pl-2">{formatDate(p.validFrom)}</span></p>
                <p className="mt-1">To: <span className="pl-2">{formatDate(p.validTo)}</span></p>
              </div>
            </div>
          ))}
        </div>
      )}
  
    </div>
  )
}

  export default ActivePasses;