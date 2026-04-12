import { useEffect, useState } from "react";

function AdminDashboard() {

  const [ngos, setNgos] = useState([]);
  const [status, setStatus] = useState("pending"); // pending | approved | rejected



  // Fetch NGOs by status
  const fetchNgos = () => {

    fetch(`http://127.0.0.1:5000/ngo/${status}`)
      .then((res) => res.json())
      .then((data) => setNgos(data))
      .catch((err) => console.log("Fetch Error:", err));
  };



  useEffect(() => {
    fetchNgos();
  }, [status]);



  // Approve NGO
  const approve = async (id) => {

    await fetch(`http://127.0.0.1:5000/ngo/approve/${id}`, {
      method: "POST",
    });

    fetchNgos();
  };



  // Reject NGO
  const reject = async (id) => {

    await fetch(`http://127.0.0.1:5000/ngo/reject/${id}`, {
      method: "POST",
    });

    fetchNgos();
  };



  return (
    <>
      {/* ---------- STYLES ---------- */}
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: "Poppins", system-ui, sans-serif;
        }

        .admin-page {
          min-height: 100vh;
          padding: 40px 20px;
          background: radial-gradient(circle at top left, #eaf7f0, #f4fbf8, #eef8f2);
        }

        .admin-card {
          max-width: 960px;
          margin: auto;
          background: white;
          border-radius: 28px;
          padding: 36px;
          box-shadow: 0 25px 50px rgba(0,0,0,0.12);
        }

        .admin-title {
          font-size: 26px;
          font-weight: 700;
          color: #2f6f4e;
          text-align: center;
          margin-bottom: 6px;
        }

        .admin-subtitle {
          font-size: 14px;
          color: #5f7d6b;
          text-align: center;
          margin-bottom: 20px;
        }

        /* Tabs */
        .tabs {
          display: flex;
          justify-content: center;
          gap: 12px;
          margin-bottom: 28px;
        }

        .tab-btn {
          padding: 8px 18px;
          border-radius: 999px;
          border: 1px solid #2f6f4e;
          background: transparent;
          color: #2f6f4e;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .tab-btn:hover {
          background: rgba(47,111,78,0.1);
        }

        .tab-btn.active {
          background: linear-gradient(135deg, #2f6f4e, #3f8f67);
          color: white;
          border: none;
          box-shadow: 0 8px 18px rgba(47,111,78,0.35);
        }

        .ngo-card {
          border: 1px solid #dfeee6;
          border-radius: 20px;
          padding: 22px;
          margin-bottom: 18px;
          background: #ffffff;
          box-shadow: 0 10px 24px rgba(0,0,0,0.08);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .ngo-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 16px 32px rgba(0,0,0,0.12);
        }

        .ngo-name {
          font-size: 18px;
          font-weight: 600;
          color: #2f6f4e;
          margin-bottom: 8px;
        }

        .ngo-info {
          font-size: 14px;
          color: #444;
          margin-bottom: 5px;
          line-height: 1.5;
        }

        .ngo-location {
          font-size: 13px;
          color: #777;
          margin-bottom: 10px;
        }

        .ngo-desc {
          font-size: 13px;
          color: #555;
          background: #f6fbf8;
          padding: 10px;
          border-radius: 10px;
          margin-top: 8px;
          margin-bottom: 10px;
        }

        .action-row {
          display: flex;
          gap: 12px;
          margin-top: 12px;
        }

        .approve-btn {
          flex: 1;
          background: linear-gradient(135deg, #2f6f4e, #3f8f67);
          color: white;
          padding: 10px;
          border: none;
          border-radius: 999px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .approve-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 12px 24px rgba(47,111,78,0.35);
        }

        .reject-btn {
          flex: 1;
          background: #d64545;
          color: white;
          padding: 10px;
          border: none;
          border-radius: 999px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .reject-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 12px 24px rgba(214,69,69,0.35);
        }

        .empty-state {
          text-align: center;
          font-size: 14px;
          color: #777;
          padding: 30px 0;
        }
      `}</style>



      <div className="admin-page">
        <div className="admin-card">


          <h1 className="admin-title">Admin – NGO Management</h1>

          <p className="admin-subtitle">
            Review, approve and manage registered NGOs
          </p>



          {/* Tabs */}
          <div className="tabs">

            <button
              className={`tab-btn ${status === "pending" ? "active" : ""}`}
              onClick={() => setStatus("pending")}
            >
              Pending
            </button>

            <button
              className={`tab-btn ${status === "approved" ? "active" : ""}`}
              onClick={() => setStatus("approved")}
            >
              Approved
            </button>

            <button
              className={`tab-btn ${status === "rejected" ? "active" : ""}`}
              onClick={() => setStatus("rejected")}
            >
              Rejected
            </button>

          </div>



          {/* Empty State */}
          {ngos.length === 0 && (
            <div className="empty-state">
              No NGOs found
            </div>
          )}



          {/* NGO Cards */}
          {ngos.map((ngo) => (

            <div key={ngo.id} className="ngo-card">


              <div className="ngo-name">{ngo.ngo_name}</div>


              <div className="ngo-info">
                🆔 Registration: {ngo.registration_number || "N/A"}
              </div>

              <div className="ngo-info">
                👤 Contact: {ngo.contact_person || "N/A"}
              </div>

              <div className="ngo-info">
                📧 {ngo.email}
              </div>

              <div className="ngo-info">
                📞 {ngo.phone}
              </div>

              <div className="ngo-info">
                🏠 {ngo.address || "N/A"}
              </div>

              <div className="ngo-location">
                📍 {ngo.city}, {ngo.state} - {ngo.pincode}
              </div>

              <div className="ngo-info">
                🌍 Latitude: {ngo.latitude} | Longitude: {ngo.longitude}
              </div>

              <div className="ngo-info">
                📏 Service Radius: {ngo.service_radius_km} km
              </div>


              <div className="ngo-desc">
                📝 {ngo.description || "No description provided"}
              </div>



              {/* Buttons only for Pending */}
              {status === "pending" && (

                <div className="action-row">

                  <button
                    className="approve-btn"
                    onClick={() => approve(ngo.id)}
                  >
                    Approve
                  </button>

                  <button
                    className="reject-btn"
                    onClick={() => reject(ngo.id)}
                  >
                    Reject
                  </button>

                </div>
              )}

            </div>
          ))}

        </div>
      </div>
    </>
  );
}

export default AdminDashboard;
