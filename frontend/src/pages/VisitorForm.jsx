import { useState } from "react";
import API from "../api/axios";

const VisitorForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [photo, setPhoto] = useState(null);
  const [date, setDate] = useState(null);
  const [purpose, setPurpose] = useState("");
  const [preview, setPreview] = useState("")
  const handleFile = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

  setPhoto(selectedFile);
  setPreview(URL.createObjectURL(selectedFile))
  };

  const submit = async (e) => {
    e.preventDefault();

    if (!name || !email || !phone || !photo) {
      alert("Please fill all details");
      return;
    }
    const formData = new FormData();
  formData.append("name", name);
  formData.append("email", email);
  formData.append("phone", phone);
  formData.append("photo", photo);
  formData.append("date",date);
  formData.append("purpose",purpose);




    await API.post("/visitors", formData);
    setName("");
    setEmail("");
    setPhone("");
    setPhoto(null);
    alert("Visitor Added");
  };

  return (
    <form className="bg-white p-6 rounded shadow w-96 mx-auto mt-6" onSubmit={submit}>
      <h2 className="text-xl font-bold mb-4">Add Visitor</h2>

      <input className="w-full border p-2 mb-2 rounded" required placeholder="Name" onChange={(e) => setName(e.target.value)} value={name} />
      <input className="w-full border p-2 mb-2 rounded" required placeholder="Email" onChange={(e) => setEmail(e.target.value)} value={email} />
      <input className="w-full border p-2 mb-2 rounded" required placeholder="Phone" onChange={(e) => setPhone(e.target.value)} value={phone} />
      <input className="w-full border p-2 mb-2 rounded" required placeholder="Purpose" onChange={(e) => setPurpose(e.target.value)} value={purpose} />
      <input
            type="date"
            name="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="w-full border p-2 mb-2 rounded"
          />
      <input
        type="file" onChange={handleFile} required
        className="w-full border rounded-lg p-2 file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-blue-500 file:text-white file:rounded file:cursor-pointer"
      />
      {preview && (
            <img
              src={preview}
              alt="Preview"
              className="w-24 h-24 object-cover rounded border"
            />
          )}
      <button className="w-full bg-blue-600 text-white py-2 rounded">
        Submit
      </button>
    </form>
  );
};

export default VisitorForm;