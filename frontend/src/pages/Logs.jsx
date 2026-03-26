import { useState, useEffect } from "react";
import API from "../api/axios";

const Logs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    search: "",
    status: "",
    fromDate: "",
    toDate: ""
  });

  const fetchLogs = async () => {
    try {
      setLoading(true);

      const res = await API.get("/dashboard/logs", {
        params: filters
      });

      setLogs(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  // 🔥 Export CSV
  const handleExport = async () => {
    const res = await API.get("/dashboard/export", {
      responseType: "blob"
    });

    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "logs.csv");
    link.click();
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      <h2 className="text-2xl font-bold mb-4">Visitor Logs</h2>

      {/* Filters */}
      <div className="bg-white p-4 rounded shadow mb-4 flex flex-wrap gap-3">

        <input
          placeholder="Search name/email"
          className="border p-2 rounded"
          onChange={(e) =>
            setFilters({ ...filters, search: e.target.value })
          }
        />

        <select
          className="border p-2 rounded"
          onChange={(e) =>
            setFilters({ ...filters, status: e.target.value })
          }
        >
          <option value="">All</option>
          <option value="not-arrived">Not Arrived</option>
          <option value="checked-in">checked In</option>
          <option value="checked-out">checkedOut</option>
        </select>

        <input
          type="date"
          className="border p-2 rounded"
          onChange={(e) =>
            setFilters({ ...filters, fromDate: e.target.value })
          }
        />

        <input
          type="date"
          className="border p-2 rounded"
          onChange={(e) =>
            setFilters({ ...filters, toDate: e.target.value })
          }
        />

        <button
          onClick={fetchLogs}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Apply
        </button>

        <button
          onClick={handleExport}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Export CSV
        </button>

      </div>

      {/* Table */}
      <div className="bg-white shadow rounded overflow-hidden">

        {loading ? (
          <p className="p-4 text-center">Loading...</p>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>Check-In</th>
                <th>Check-Out</th>
              </tr>
            </thead>

            <tbody>
              {logs.length > 0 ? (
                logs.map((log) => (
                  <tr key={log._id} className="border-t hover:bg-gray-50">

                    <td className="p-3">
                      {log.name}
                    </td>

                    <td>{log.email}</td>

                    <td>
                  
                        {log.visitStatus}
                    </td>

                    <td>
                      {log.checkInTime
                        ? new Date(log.checkInTime).toLocaleString("en-IN")
                        : "-"}
                    </td>

                    <td>
                      {log.checkOutTime
                        ? new Date(log.checkOutTime).toLocaleString("en-IN")
                        : "-"}
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center p-4">
                    No logs found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

    </div>
  );
};

export default Logs;