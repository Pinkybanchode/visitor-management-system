import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
const ScanPage = () => {
  const scannerRef = useRef(null);
  const isStoppedRef = useRef(false);
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [scanning, setScanning] = useState(false);
  const startScanner = () => {
    setMessage("");
    setStatus("");
    isStoppedRef.current = false;
    setScanning(true);
  };
  const stopScanner = async () => {
    if (!scannerRef.current || isStoppedRef.current) return;

    isStoppedRef.current = true;

    try {
      await scannerRef.current.stop();
    } catch (e) {
    }
  };
  useEffect(() => {
    if (!scanning) return;

    const scanner = new Html5Qrcode("reader");
    scannerRef.current = scanner;

    scanner
      .start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 }
        },
        async (decodedText) => {
          await stopScanner();
          setScanning(false);

          try {
            const res = await API.post("/scan", {
              qrData: decodedText
            });

            setMessage(res.data.message);
            setStatus("success");
            navigate("/logs");

          } catch (err) {
            setMessage(err.response?.data?.message || "Scan failed");
            setStatus("error");
          }
        }
      )
      .catch((err) => {
        console.log(err);
        setMessage("Camera access denied");
        setStatus("error");
        setScanning(false);
      });
    return () => {
      stopScanner();
    };
  }, [scanning]);

  return (
    <div className="flex flex-col items-center p-4">

      <h2 className="text-xl font-bold mb-4">Scan Visitor QR</h2>
      {!scanning && (
        <button
          onClick={startScanner}
          className="bg-purple-600 text-white px-4 py-2 rounded" >
          Start Scan
        </button>
      )}

      {scanning && (
        <div
          id="reader"
          className="w-[320px] mt-4 border rounded-lg"
        />
      )}

      {message && (
        <div
          className={`mt-4 p-4 rounded text-white w-[320px] text-center ${
            status === "success"
              ? "bg-green-500"
              : "bg-red-500"
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
};

export default ScanPage;