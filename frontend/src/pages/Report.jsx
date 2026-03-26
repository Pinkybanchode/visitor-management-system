import { useState, useEffect } from "react";
import API from "../api/axios";

const Reports = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    search: "",
    status: "",
    fromDate: "",
    toDate: ""
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await API.get("/dashboard/reports", {
        params: filters
      });

      setData(res.data.data || res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        Visitor Reports
      </h2>
      <div className="bg-white p-4 rounded-lg shadow mb-6 flex flex-wrap gap-3 items-center">
        <input
          placeholder="Search by name/email"
          className="border p-2 rounded w-48"
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
          <option value="">All Status</option>
          <option value="approved">Approved</option>
          <option value="pending">Pending</option>
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
          onClick={fetchData}
          className="bg-purple-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Apply
        </button>

        <button
          onClick={() => window.open("/dashboard/export")}
          className="bg-purple-500 hover:bg-green-600 text-white px-4 py-2 rounded"
        >
          Export CSV
        </button>
      </div>
      <div className="bg-white rounded-lg shadow overflow-hidden">

        {loading ? (
          <div className="p-6 text-center text-gray-500">
            Loading...
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-100 text-gray-700 text-sm uppercase">
              <tr>
                <th className="p-3 text-left">Visitor</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-center">Date</th>
              </tr>
            </thead>

            <tbody>
              {data.length > 0 ? (
                data.map((item) => (
                  <tr
                    key={item._id}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    <td className="p-3 font-medium text-gray-800">
                      {item.visitorId?.name || "-"}
                    </td>

                    <td className="p-3 text-gray-600">
                      {item.visitorId?.email || "-"}
                    </td>

                    <td className="p-3 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold
                          ${
                            item.status === "approved"
                              ? "bg-green-100 text-green-700"
                              : item.status === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                      >
                        {item.status || "N/A"}
                      </span>
                    </td>

                    <td className="p-3 text-center text-gray-500">
                      {item.createdAt
                        ? new Date(item.createdAt).toLocaleString("en-IN", {
                            dateStyle: "medium",
                            timeStyle: "short"
                          })
                        : "-"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="text-center p-6 text-gray-500"
                  >
                    No reports found
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

export default Reports;