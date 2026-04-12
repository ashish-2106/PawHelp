import React, { useState } from "react";
import API from "../services/api";

function ReportAnimal() {
  // -------------------- STATE --------------------
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [location, setLocation] = useState(null);
  const [status, setStatus] = useState("");

  const [speciesResult, setSpeciesResult] = useState(null);
  const [injuryResult, setInjuryResult] = useState(null);
  const [firstAid, setFirstAid] = useState(null);

  const [submitted, setSubmitted] = useState(false);
  const [progressStep, setProgressStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // -------------------- IMAGE HANDLER --------------------
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));

    // Reset previous AI results
    setSpeciesResult(null);
    setInjuryResult(null);
    setFirstAid(null);
    setSubmitted(false);
    setStatus("");
    setProgressStep(0);
  };

  // -------------------- LOCATION HANDLER --------------------
  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      () => alert("Location permission denied"),
    );
  };

  // -------------------- SUBMIT REPORT --------------------
  const submitReport = async () => {
    if (!image || !location) {
      alert("Please upload image and get location first");
      return;
    }

    const user_id = localStorage.getItem("user_id");

    const formData = new FormData();
    formData.append("image", image);
    formData.append("lat", location.lat);
    formData.append("lng", location.lng);
    formData.append("user_id", user_id);

    try {
      setIsSubmitting(true);
      setProgressStep(1); // 🔥 Submitting

      const res = await API.post("/report", formData);

      setProgressStep(2); // ✅ Submitted
      setIsSubmitting(false);

      // 🐾 Species
      if (res.data.species_detections?.length > 0) {
        setSpeciesResult(res.data.species_detections[0]);
      }

      // 🩺 Injury
      setInjuryResult(res.data.injury_analysis || null);

      // 🧠 First Aid
      setFirstAid(res.data.first_aid || null);

      setSubmitted(true);
      setStatus("Report submitted successfully");

      // 🔥 Simulate NGO flow (until backend real-time)
      setTimeout(() => setProgressStep(3), 5000); // NGO Assigned after 5 sec
      setTimeout(() => setProgressStep(4), 10000); // Accepted
      // Step 5 (Rescued) intentionally not auto-triggered — progress bar stops at Accepted
    } catch (err) {
      console.error(err.response?.data);
      setStatus(err.response?.data?.error || "Error submitting report");
      setProgressStep(0);
      setIsSubmitting(false);
    }
  };

  // Progress steps config: label, step number, emoji
  const progressSteps = [
    { label: "Submitting", step: 1, emoji: "📤" },
    { label: "Submitted", step: 2, emoji: "✅" },
    { label: "NGO Assigned", step: 3, emoji: "🏢" },
    { label: "Accepted", step: 4, emoji: "🤝" },
    { label: "Rescued", step: 5, emoji: "🐾" },
  ];

  // Progress bar fills only up to step 4 (Accepted)
  const progressPercent = Math.min(progressStep, 4) * 25; // 4 segments = 25% each

  // -------------------- UI --------------------
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

        .report-container {
          min-height: 90vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #f6fff9, #e3f4ee);
          font-family: "Segoe UI", sans-serif;
          padding: 30px;
        }

        .report-card {
          background: white;
          width: 100%;
          max-width: 520px;
          padding: 30px;
          border-radius: 18px;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
        }

        .report-card h2 {
          text-align: center;
          color: #2f6f4e;
          margin-bottom: 20px;
        }

        .section {
          margin-top: 20px;
        }

        .divider {
          height: 1px;
          background: #e0efe8;
          margin: 25px 0;
        }

        .upload-section {
          display: flex;
          gap: 10px;
        }

        .file-input {
          display: none;
        }

        .upload-btn {
          flex: 1;
          padding: 10px;
          border-radius: 20px;
          border: 1px dashed #2f6f4e;
          background: #f1fbf6;
          color: #2f6f4e;
          cursor: pointer;
          text-align: center;
          font-weight: 500;
        }

        .preview-img {
          width: 100%;
          border-radius: 14px;
          margin-top: 12px;
        }

        .ai-box {
          padding: 15px;
          border-radius: 14px;
          background: #f1fbf6;
          font-weight: 600;
          color: #2f6f4e;
        }

        .ai-box ul {
          padding-left: 18px;
          margin-top: 10px;
        }

        .btn {
          width: 100%;
          padding: 12px;
          border: none;
          border-radius: 25px;
          cursor: pointer;
          font-size: 1rem;
          font-weight: 500;
        }

        .btn-location {
          background: #e8f5ee;
          color: #2f6f4e;
        }

        .btn-submit {
          background: #2f6f4e;
          color: white;
          margin-top: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          opacity: 1;
          transition: opacity 0.2s;
        }

        .btn-submit:disabled {
          opacity: 0.75;
          cursor: not-allowed;
        }

        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255,255,255,0.4);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          display: inline-block;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .location-text {
          margin-top: 10px;
          text-align: center;
          font-size: 0.9rem;
        }

        .status-text {
          margin-top: 15px;
          text-align: center;
          font-weight: 600;
        }

        .disclaimer {
          font-size: 0.8rem;
          margin-top: 10px;
          color: #555;
        }

        /* ---- PROGRESS BAR ---- */
        .progress-section {
          margin-top: 24px;
          background: #f1fbf6;
          border-radius: 14px;
          padding: 18px 16px 14px;
        }

        .progress-title {
          font-size: 0.85rem;
          font-weight: 700;
          color: #2f6f4e;
          margin-bottom: 14px;
          text-align: center;
          letter-spacing: 0.3px;
        }

        .progress-track {
          position: relative;
          height: 6px;
          background: #d4ede1;
          border-radius: 10px;
          margin: 0 12px;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #2f6f4e, #52c17a);
          border-radius: 10px;
          transition: width 0.6s ease;
        }

        .progress-dots {
          display: flex;
          justify-content: space-between;
          margin: 0 12px;
          margin-top: -4px;
        }

        .progress-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #d4ede1;
          border: 2px solid #d4ede1;
          transition: background 0.4s, border-color 0.4s;
          margin-top: -3px;
        }

        .progress-dot.done {
          background: #2f6f4e;
          border-color: #2f6f4e;
        }

        .progress-dot.active-pulse {
          background: #52c17a;
          border-color: #2f6f4e;
          animation: pulse 1.2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(82,193,122,0.4); }
          50% { transform: scale(1.25); box-shadow: 0 0 0 5px rgba(82,193,122,0); }
        }

        .progress-labels {
          display: flex;
          justify-content: space-between;
          margin-top: 10px;
          padding: 0 4px;
        }

        .progress-label {
          font-size: 0.68rem;
          color: #aaa;
          text-align: center;
          flex: 1;
          font-weight: 500;
          transition: color 0.4s;
          line-height: 1.3;
        }

        .progress-label.done {
          color: #2f6f4e;
          font-weight: 700;
        }

        .progress-label.current {
          color: #38a169;
          font-weight: 700;
        }
      `}</style>

      <div className="report-container">
        <div className="report-card">
          <h2>Report Injured Animal 🐾</h2>

          {/* IMAGE */}
          <div className="section">
            <div className="upload-section">
              <label className="upload-btn">
                📂 Upload Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImage}
                  className="file-input"
                />
              </label>

              <label className="upload-btn">
                📸 Camera
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleImage}
                  className="file-input"
                />
              </label>
            </div>

            {preview && (
              <img src={preview} alt="Animal Preview" className="preview-img" />
            )}
          </div>

          {/* LOCATION */}
          <div className="section">
            <button onClick={getLocation} className="btn btn-location">
              Get Live Location 📍
            </button>

            {location && (
              <div className="location-text">
                Latitude: {location.lat.toFixed(5)}
                <br />
                Longitude: {location.lng.toFixed(5)}
              </div>
            )}
          </div>

          {/* SUBMIT */}
          <div className="section">
            <button
              onClick={submitReport}
              className="btn btn-submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner"></span>
                  Submitting...
                </>
              ) : (
                "Submit Rescue Report"
              )}
            </button>

            {status && <div className="status-text">{status}</div>}
          </div>

          {/* PROGRESS BAR — shown as soon as submit is clicked */}
          {/* {progressStep > 0 && (
            <div className="progress-section">
              <div className="progress-title">🚑 Rescue Progress</div>

              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <div className="progress-dots">
                {progressSteps.map(({ step }) => {
                  const isDone = progressStep > step;
                  const isCurrent = progressStep === step;
                  return (
                    <div
                      key={step}
                      className={`progress-dot ${isDone ? "done" : ""} ${isCurrent ? "active-pulse" : ""}`}
                    />
                  );
                })}
              </div>

              <div className="progress-labels">
                {progressSteps.map(({ label, step, emoji }) => {
                  const isDone = progressStep > step;
                  const isCurrent = progressStep === step;
                  return (
                    <div
                      key={step}
                      className={`progress-label ${isDone ? "done" : ""} ${isCurrent ? "current" : ""}`}
                    >
                      {emoji}
                      <br />
                      {label}
                    </div>
                  );
                })}
              </div>
            </div>
          )} */}

          {/* AI RESULTS */}
          {submitted && (
            <>
              <div className="divider" />

              {/* SPECIES */}
              {speciesResult && (
                <div className="section ai-box">
                  🐾 <b>Species Detected</b>
                  <br />
                  {speciesResult.species.toUpperCase()} <br />
                  Confidence: {(speciesResult.confidence * 100).toFixed(2)}%
                </div>
              )}

              {/* INJURY */}
              {injuryResult && (
                <div className="section ai-box">
                  🩺 <b>Injury Analysis</b>
                  <br />
                  Type: {injuryResult.injury_status} <br />
                  Severity: {injuryResult.severity.toUpperCase()}
                </div>
              )}

              {/* FIRST AID */}
              {firstAid && (
                <div className="section ai-box">
                  🧠 <b>AI First Aid</b>
                  <ul>
                    {firstAid.steps.map((step, index) => (
                      <li key={index}>{step}</li>
                    ))}
                  </ul>
                  <div className="disclaimer">{firstAid.disclaimer}</div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default ReportAnimal;