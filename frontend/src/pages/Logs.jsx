import { useEffect, useState } from "react";
import API from "../api/axios";

const Logs = () => {
  const [logs, setLogs] = useState([]);

  const fetchLogs = async () => {
    try {
      const res = await API.get("/logs");
      setLogs(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Visitor Logs</h2>

      <div className="overflow-x-auto">
        <table className="w-full border">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 border">Visitor</th>
              <th className="p-2 border">Check-In</th>
              <th className="p-2 border">Check-Out</th>
              <th className="p-2 border">Status</th>
            </tr>
          </thead>

          <tbody>
            {logs.map((log) => (
              <tr key={log._id}>
                <td className="p-2 border">
                  {log.visitorId?.name}
                </td>
                <td className="p-2 border">
                  {log.checkInTime
                    ? new Date(log.checkInTime).toLocaleString("en-IN", {
                      dateStyle: "medium",
                      timeStyle: "short"
                    })
                    : "-"}
                </td>
                <td className="p-2 border">
                  {log.checkInTime
                    ? new Date(log.checkOutTime).toLocaleString("en-IN", {
                      dateStyle: "medium",
                      timeStyle: "short"
                    })
                    : "-"}
                </td>
                <td className="p-2 border">{log.passId.visitStatus}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Logs;