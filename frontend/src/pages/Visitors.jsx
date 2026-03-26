import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import API from "../api/axios";

const Visitors = () => {
  const { user } = useAuth();
  //const [visitors, setVisitors] = useState([]);
  const [passes, setPasses] = useState([]);
  const fetchPasses = async () => {
    const res = await API.get("/passes")
    setPasses(res.data.data);
  }


const formatDate = (date) => {
  return new Date(date).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};
  useEffect(() => {
    if (user) {
      fetchPasses();
    }
  }, [user]);

  return (
    <div className="p-4">
      {passes.length === 0 ? (
        <p>No visitors found</p>
      ) : (
        passes.map((v) => (
          <div key={v._id} className="border p-3 mb-2 rounded">
            <p className="font-semibold">{v.visitorId.name}</p>
            <p className="">{formatDate(v.validTo)}</p>
            <p>{v.visitStatus}</p>
            <img src={v.qrCode} alt="QR Code" className="w-32 h-32 mt-2" />
          </div>
        ))
      )}
    </div>
  );
};

export default Visitors;