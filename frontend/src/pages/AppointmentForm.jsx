import { useState } from "react";
import API from "../api/axios";

const AppointmentForm = () => {
  const [formData, setFormData] = useState({
    visitorName: "",
    visitorEmail: "",
    visitorPhone: "",
    hostEmail: "",
    purpose: "",
    date: "",
  });

  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleFile = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setPhoto(selectedFile);
    setPreview(URL.createObjectURL(selectedFile))
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });
      if (photo) {
        data.append("photo", photo);
      }

      await API.post("/appointment", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage("Appointment request sent successfully!");
      setFormData({
        visitorName: "",
        visitorEmail: "",
        visitorPhone: "",
        hostEmail: "",
        purpose: "",
        date: "",
      });
      setPhoto(null);
      setPreview(null);

    } catch (err) {
      setMessage(
        err.response?.data?.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-700">
          Create Appointment
        </h2>

        {message && (
          <p className="mb-3 text-center text-sm text-blue-500">
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">

          <input
            type="text"
            name="visitorName"
            placeholder="Visitor Name"
            value={formData.visitorName}
            onChange={handleChange}
            required
            className="border p-2 rounded-lg"
          />

          <input
            type="email"
            name="visitorEmail"
            placeholder="Visitor Email"
            value={formData.visitorEmail}
            onChange={handleChange}
            required
            className="border p-2 rounded-lg"
          />

          <input
            type="text"
            name="visitorPhone"
            placeholder="Visitor Phone"
            value={formData.visitorPhone}
            onChange={handleChange}
            required
            className="border p-2 rounded-lg"
          />

          <input
            type="email"
            name="hostEmail"
            placeholder="Host (Employee) Email"
            value={formData.hostEmail}
            onChange={handleChange}
            required
            className="border p-2 rounded-lg"
          />

          <input
            type="text"
            name="purpose"
            placeholder="Purpose of Visit"
            value={formData.purpose}
            onChange={handleChange}
            required
            className="border p-2 rounded-lg"
          />

          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="border p-2 rounded-lg"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleFile}
            className="border p-2 rounded-lg file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-blue-500 file:text-white file:rounded file:cursor-pointer"
          />
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="w-24 h-24 object-cover rounded border"
            />
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
          >
            {loading ? "Submitting..." : "Submit Request"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AppointmentForm;
