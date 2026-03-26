import { useState } from "react";
import API from "../api/axios";

const WalkInVisitor = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    hostEmail: "",
    purpose: "",
  });
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleFile = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setPhoto(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const data = new FormData();

      Object.keys(form).forEach((key) => {
        data.append(key, form[key]);
      });

      if (photo) {
        data.append("photo", photo);
      }
      const res = await API.post("/passes/walkin", data,{
        headers: {
          "Content-Type": "multipart/form-data",
        }
    });

    console.log(res.data);

      setMessage("Pass created for walk-in visitor");

      setForm({
        name: "",
        email: "",
        phone: "",
        hostEmail: "",
        purpose: "",
      });

    } catch (err) {
      setMessage(err.response?.data?.message || "Error");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow w-full max-w-md flex flex-col gap-3"
      >
        <h2 className="text-xl font-bold text-center">
          Walk-in Visitor Pass
        </h2>

        <input name="name" placeholder="Name" onChange={handleChange} className="border p-2" required />
        <input name="email" placeholder="Email" onChange={handleChange} className="border p-2" required />
        <input name="phone" placeholder="Phone" onChange={handleChange} className="border p-2" required />
        <input name="hostEmail" placeholder="Host Email" onChange={handleChange} className="border p-2" required />
        <input name="purpose" placeholder="Purpose" onChange={handleChange} className="border p-2" required />
        <input
            type="file"
            accept="image/*"
            onChange={handleFile}
            className="border p-2 rounded-lg"
          />

          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="w-24 h-24 object-cover rounded border"
            />
          )}

        <button className="bg-blue-500 text-white p-2 rounded">
          Create Pass
        </button>

        {message && <p className="text-center">{message}</p>}
      </form>
    </div>
  );
};

export default WalkInVisitor;