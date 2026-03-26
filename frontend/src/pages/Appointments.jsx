import { useEffect, useState } from "react";
import API from "../api/axios";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [message, setMessage] = useState("");
  //const backend_URI = `http://localhost:4000`;
  const backend_URI = `https://visitor-management-system-i849.onrender.com`
  const fetchAppointments = async () => {
    try {
      const res = await API.get("/appointment/my");
      setAppointments(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleAction = async (id, status) => {
    try {
      await API.put(`/appointment/${id}/status`, { status });

      setMessage(`Appointment ${status}`);
      fetchAppointments();
    } catch (err) {
      setMessage(
        err.response?.data?.message || "Error updating status"
      );
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">
        My Appointment Requests
      </h2>

      {message && (
        <p className="text-green-600 mb-3">{message}</p>
      )}

      <div className="grid gap-4">
        {appointments.length === 0 ? (
          <p>No pending appointments</p>
        ) : (
          appointments.map((appt) => (
            <div
              key={appt._id}
              className="border p-4 rounded shadow flex justify-between items-center"
            >
              <div className="flex gap-4 items-center">
                {appt.visitorId?.photo && (
                  <img
                    src={`${backend_URI}/uploads/${appt.visitorId.photo}`}
                    alt="visitor"
                    className="w-16 h-16 rounded object-cover"
                  />
                )}

                <div>
                  <h3 className="font-semibold text-lg">
                    {appt.visitorId?.name}
                  </h3>
                  <p>Email: {appt.visitorId?.email}</p>
                  <p>Phone: {appt.visitorId?.phone}</p>
                  <p>Purpose: {appt.purpose}</p>
                  <p>
                    Visit Date:{" "}
                    {new Date(appt.visitDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    handleAction(appt._id, "approved")
                  }
                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                >
                  Approve
                </button>

                <button
                  onClick={() =>
                    handleAction(appt._id, "rejected")
                  }
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Reject
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Appointments;