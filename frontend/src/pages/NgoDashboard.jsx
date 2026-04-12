import { useEffect, useState } from "react";
import API from "../services/api";

function NgoDashboard() {

  const [requests, setRequests] = useState([]);

  // ---------------- FETCH REQUESTS ----------------
  useEffect(() => {

    const fetchRequests = async () => {
      try {
        const res = await API.get("/ngo/requests");

        // ✅ Add default status if missing
        const updated = (res.data.requests || []).map(r => ({
          ...r,
          status: r.status || "PENDING"
        }));

        setRequests(updated);

      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    };

    fetchRequests();

    const interval = setInterval(fetchRequests, 5000);

    return () => clearInterval(interval);

  }, []);


  // ---------------- ACCEPT REQUEST ----------------
  const acceptRequest = async (id) => {

    try {
      await API.get(`/ngo/accept/${id}`);

      // ✅ DO NOT REMOVE → update status
      setRequests((prev) =>
        prev.map((req) =>
          req.id === id ? { ...req, status: "ACCEPTED" } : req
        )
      );

    } catch (error) {
      console.error("Error accepting request:", error);
    }

  };


  // ---------------- MARK RESCUED ----------------
  const markRescued = async (id) => {
  try {
    await API.get(`/ngo/rescue/${id}`);   // ✅ CALL BACKEND

    setRequests((prev) =>
      prev.map((req) =>
        req.id === id ? { ...req, status: "RESCUED" } : req
      )
    );

  } catch (error) {
    console.error("Error marking rescued:", error);
  }
};


  // ---------------- CONDITION COLOR ----------------
  const getConditionColor = (condition) => {

    if (!condition) return "green";

    const c = condition.toLowerCase();

    if (c.includes("critical")) return "red";
    if (c.includes("moderate")) return "orange";

    return "green";

  };


  return (
    <div className="ngo-dashboard-page">

      {/* ---------- STYLES ---------- */}
      <style>{`

      *{
        margin:0;
        padding:0;
        box-sizing:border-box;
        font-family:Poppins,system-ui,sans-serif;
      }

      .ngo-dashboard-page{
        min-height:100vh;
        padding:30px 15px;
        background:radial-gradient(circle at top left,#eaf7f0,#f4fbf8,#eef8f2);
      }

      .ngo-dashboard-card{
        max-width:1100px;
        margin:auto;
        background:white;
        border-radius:20px;
        padding:25px;
        box-shadow:0 15px 40px rgba(0,0,0,0.12);
      }

      .ngo-dashboard-title{
        font-size:22px;
        font-weight:700;
        color:#2f6f4e;
        text-align:center;
        margin-bottom:5px;
      }

      .ngo-dashboard-subtitle{
        font-size:13px;
        color:#5f7d6b;
        text-align:center;
        margin-bottom:20px;
      }

      .requests-grid{
        display:grid;
        grid-template-columns:repeat(auto-fill,minmax(240px,1fr));
        gap:15px;
      }

      .request-card{
        border:1px solid #dfeee6;
        border-radius:16px;
        padding:12px;
        background:#fff;
        box-shadow:0 6px 16px rgba(0,0,0,0.08);
      }

      .request-image{
        width:100%;
        height:140px;
        object-fit:cover;
        border-radius:10px;
        margin-bottom:8px;
      }

      .request-title{
        font-size:15px;
        font-weight:600;
        color:#2f6f4e;
        margin-bottom:5px;
      }

      .request-info{
        font-size:13px;
        margin-bottom:4px;
      }

      .request-location{
        font-size:12px;
        color:#777;
        margin-bottom:8px;
      }

      .accept-btn{
        width:100%;
        background:#16a34a;
        color:white;
        padding:8px;
        border:none;
        border-radius:999px;
        font-size:13px;
        font-weight:600;
        cursor:pointer;
      }

      .rescue-btn{
        width:100%;
        background:#2563eb;
        color:white;
        padding:8px;
        border:none;
        border-radius:999px;
        font-size:13px;
        font-weight:600;
        cursor:pointer;
      }

      .completed-text{
        text-align:center;
        color:#16a34a;
        font-weight:600;
        font-size:13px;
      }

      .empty-state{
        text-align:center;
        font-size:14px;
        color:#777;
        padding:20px 0;
      }

      `}</style>


      <div className="ngo-dashboard-card">

        <h2 className="ngo-dashboard-title">
          🐾 NGO Rescue Requests ({requests.length})
        </h2>

        <p className="ngo-dashboard-subtitle">
          View and manage rescue requests
        </p>


        {requests.length === 0 && (
          <div className="empty-state">
            No rescue requests
          </div>
        )}


        <div className="requests-grid">

          {requests.map((req) => (

            <div key={req.id} className="request-card">

              {req.image_path && (
                <img
                  src={`http://localhost:5000/${req.image_path}`}
                  alt="animal"
                  className="request-image"
                />
              )}

              <div className="request-title">
                {req.animal || req.species || "Animal"}
              </div>

              <div className="request-info">
                <strong>Condition:</strong>{" "}
                <span style={{ color: getConditionColor(req.condition) }}>
                  {req.condition || "unknown"}
                </span>
              </div>

              <div className="request-location">
                📍 {req.latitude}, {req.longitude}
              </div>

              {/* -------- BUTTON LOGIC -------- */}
              {req.status === "PENDING" && (
                <button
                  className="accept-btn"
                  onClick={() => acceptRequest(req.id)}
                >
                  Accept Rescue
                </button>
              )}

              {req.status === "ACCEPTED" && (
                <button
                  className="rescue-btn"
                  onClick={() => markRescued(req.id)}
                >
                  Mark as Rescued
                </button>
              )}

              {req.status === "RESCUED" && (
                <div className="completed-text">
                  ✅ Rescue Completed
                </div>
              )}

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}

export default NgoDashboard;