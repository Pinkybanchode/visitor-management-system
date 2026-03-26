import { useEffect, useState } from "react";
import API from "../api/axios";

const AdminDashboard = () => {
  const [stats, setStats] = useState({});

  const fetchStats = async () => {
    await API.get("/dashboard/stats").then(res => setStats(res.data));
  }
  useEffect(() => {
    fetchStats()
      
  }, []);

  return (
    <div className="p-6 grid grid-cols-4 gap-4">
      <Card title="Total Visitors" value={stats.totalVisits} />
      <Card title="CheckIns" value={stats.todayCheckIns} />
      <Card title="CheckOuts" value={stats.todayCheckOuts} />
      <Card title="Active Visitors" value={stats.activeVisitors} />
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className="bg-white shadow rounded-xl p-4">
      <h2 className="text-gray-500">{title}</h2>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}

export default AdminDashboard