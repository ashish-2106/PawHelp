import { useState } from "react";

function NgoApply() {
  const [form, setForm] = useState({
    ngo_name: "",
    registration_number: "",
    description: "",
    contact_person: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    latitude: "",
    longitude: "",
    service_radius_km: "",
  });

  const userId = localStorage.getItem("user_id");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitForm = async (e) => {
    e.preventDefault();

    await fetch("http://127.0.0.1:5000/ngo/apply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: userId,
        ...form,
      }),
    });

    alert("NGO application submitted. Please wait for admin approval.");
  };

  return (
    <>
      {/* ---------- STYLES ---------- */}
      <style>{`
        .ngo-page {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 40px 20px;
          background: radial-gradient(circle at top left, #eaf7f0, #f4fbf8, #eef8f2);
          font-family: "Poppins", system-ui, sans-serif;
        }

        .ngo-card {
          background: white;
          width: 100%;
          max-width: 720px;
          padding: 36px;
          border-radius: 28px;
          box-shadow: 0 25px 50px rgba(0,0,0,0.12);
        }

        .ngo-title {
          font-size: 26px;
          font-weight: 700;
          color: #2f6f4e;
          margin-bottom: 6px;
          text-align: center;
        }

        .ngo-subtitle {
          font-size: 14px;
          color: #5f7d6b;
          text-align: center;
          margin-bottom: 28px;
        }

        .ngo-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 14px;
        }

        .ngo-input,
        .ngo-textarea {
          padding: 14px;
          border-radius: 14px;
          border: 1px solid #dfeee6;
          font-size: 14px;
          transition: all 0.2s ease;
        }

        .ngo-input:focus,
        .ngo-textarea:focus {
          outline: none;
          border-color: #2f6f4e;
          box-shadow: 0 0 0 2px rgba(47, 111, 78, 0.15);
        }

        .ngo-textarea {
          grid-column: 1 / -1;
          resize: vertical;
          min-height: 90px;
        }

        .ngo-submit {
          margin-top: 24px;
          width: 100%;
          padding: 14px;
          border-radius: 999px;
          border: none;
          background: linear-gradient(135deg, #2f6f4e, #3f8f67);
          color: white;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .ngo-submit:hover {
          transform: translateY(-1px);
          box-shadow: 0 12px 24px rgba(47,111,78,0.35);
        }
      `}</style>

      <div className="ngo-page">
        <form className="ngo-card" onSubmit={submitForm}>
          <h2 className="ngo-title">Apply as NGO 🐾</h2>
          <p className="ngo-subtitle">
            Submit your NGO details for verification and approval
          </p>

          <div className="ngo-grid">
            <input
              className="ngo-input"
              name="ngo_name"
              placeholder="NGO Name"
              value={form.ngo_name}
              onChange={handleChange}
              required
            />

            <input
              className="ngo-input"
              name="registration_number"
              placeholder="Registration Number"
              value={form.registration_number}
              onChange={handleChange}
            />

            <input
              className="ngo-input"
              name="contact_person"
              placeholder="Contact Person"
              value={form.contact_person}
              onChange={handleChange}
            />

            <input
              className="ngo-input"
              name="phone"
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleChange}
              required
            />

            <input
              className="ngo-input"
              name="email"
              placeholder="Official Email"
              value={form.email}
              onChange={handleChange}
              required
            />

            <input
              className="ngo-input"
              name="address"
              placeholder="Address"
              value={form.address}
              onChange={handleChange}
            />

            <input
              className="ngo-input"
              name="city"
              placeholder="City"
              value={form.city}
              onChange={handleChange}
            />

            <input
              className="ngo-input"
              name="state"
              placeholder="State"
              value={form.state}
              onChange={handleChange}
            />

            <input
              className="ngo-input"
              name="pincode"
              placeholder="Pincode"
              value={form.pincode}
              onChange={handleChange}
            />

            <input
              className="ngo-input"
              name="latitude"
              placeholder="Latitude"
              value={form.latitude}
              onChange={handleChange}
            />

            <input
              className="ngo-input"
              name="longitude"
              placeholder="Longitude"
              value={form.longitude}
              onChange={handleChange}
            />

            <input
              className="ngo-input"
              name="service_radius_km"
              placeholder="Service Radius (km)"
              value={form.service_radius_km}
              onChange={handleChange}
            />

            <textarea
              className="ngo-textarea"
              name="description"
              placeholder="Describe your NGO and services"
              value={form.description}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="ngo-submit">
            Submit Application
          </button>
        </form>
      </div>
    </>
  );
}

export default NgoApply;
