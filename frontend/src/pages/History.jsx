import React, { useEffect, useState } from "react";
import API from "../services/api";

function ReportHistory() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  // ---------------- FETCH REPORTS ----------------
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const user_id = localStorage.getItem("user_id");

        if (!user_id) {
          console.error("No user_id found");
          setLoading(false);
          return;
        }

        const res = await API.get(`/history/my-reports?user_id=${user_id}`);

        setReports(res.data.reports || []);
      } catch (err) {
        console.error("Error fetching reports:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  // ---------------- UI ----------------
  return (
    <>
    <style>{`
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      body {
        margin: 0;
        padding: 0;
      }
    `}</style>
    <div style={styles.container}>
      <h2 style={styles.title}>📜 My Report History</h2>

      {loading ? (
        <p>Loading reports...</p>
      ) : reports.length === 0 ? (
        <p>No reports found</p>
      ) : (
        <div style={styles.grid}>
          {reports.map((report) => (
            <div key={report.id} style={styles.card}>
              
              {/* IMAGE */}
              <img
                src={`http://localhost:5000/${report.image_path}`}
                alt="animal"
                style={styles.image}
              />

              {/* DETAILS */}
              <div style={styles.details}>
                <p><b>🐾 Species:</b> {report.species}</p>
                <p><b>🩺 Injury:</b> {report.injury_type}</p>
                <p><b>⚠️ Severity:</b> {report.severity}</p>

                {/* STATUS */}
                <p>
                  <b>📌 Status:</b>{" "}
                  <span
                    style={{
                      ...styles.status,
                      backgroundColor:
                        report.status === "PENDING"
                          ? "#f87171"
                          : report.status === "ACCEPTED"
                          ? "#4ade80"
                          : "#facc15",
                    }}
                  >
                    {report.status}
                  </span>
                </p>

                {/* DATE */}
                <p style={styles.date}>
                  📅 {new Date(report.created_at).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    </>
  );
}

export default ReportHistory;



// ---------------- STYLES ----------------
const styles = {
  
  container: {
    padding: "20px",
    background: "#f6fff9",
    minHeight: "100vh",
    fontFamily: "Segoe UI, sans-serif",
  },

  title: {
    textAlign: "center",
    marginBottom: "20px",
    color: "#2f6f4e",
  },

  // 🔥 GRID FIX (no full width cards)
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 300px))",
    justifyContent: "center",   // 🔥 center cards
    gap: "20px",
  },

  // 🔥 COMPACT CARD
  card: {
    background: "white",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    overflow: "hidden",
    width: "100%",
  },

  // 🔥 IMAGE (perfect fit)
  image: {
    width: "100%",
    height: "160px",
    objectFit: "cover",
    display: "block",
  },

  // 🔥 CONTENT (tight spacing)
  details: {
    padding: "10px 12px",
    fontSize: "0.9rem",
    lineHeight: "1.4",
  },

  status: {
    padding: "3px 8px",
    borderRadius: "8px",
    fontSize: "0.75rem",
    fontWeight: "bold",
  },

  date: {
    marginTop: "6px",
    fontSize: "0.75rem",
    color: "#666",
  },
};