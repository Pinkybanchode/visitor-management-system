import { useEffect, useState } from "react";
import API from "../api/axios"

const ApprovedAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [message, setMessage] = useState("");

  const fetchAppointments = async () => {
    try {
      const res = await API.get("/appointment")
      console.log(res);
      setAppointments(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleIssuePass = async (appointmentId) => {
    try {
      const res = API.post(`/passes/${appointmentId}`)
      console.log(res.data);
      setMessage("Pass issued successfully!");
      fetchAppointments();
    } catch (err) {
      setMessage(
        err.response?.data?.message || "Error issuing pass"
      );
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">
        Approved Appointments
      </h2>

      {message && (
        <p className="text-green-600 mb-3">{message}</p>
      )}

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 border">Visitor Name</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Phone</th>
              <th className="p-2 border">Host</th>
              <th className="p-2 border">Purpose</th>
              <th className="p-2 border">Visit Date</th>
              <th className="p-2 border">Action</th>
            </tr>
          </thead>

          <tbody>
            {appointments.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center p-4">
                  No approved appointments
                </td>
              </tr>
            ) : (
              appointments.map((appt) => (
                <tr key={appt._id}>
                  <td className="p-2 border">{appt.visitorId.name}</td>
                  <td className="p-2 border">{appt.visitorId.email}</td>
                  <td className="p-2 border">{appt.visitorId.phone}</td>
                  <td className="p-2 border">
                    {appt.hostId?.name || "N/A"}
                  </td>
                  <td className="p-2 border">{appt.purpose}</td>
                  <td className="p-2 border">
                    {new Date(appt.visitDate).toLocaleDateString()}
                  </td>
                  <td className="p-2 border">
                    <button
                      onClick={() => handleIssuePass(appt._id)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      Issue Pass
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ApprovedAppointments;