from inference_sdk import InferenceHTTPClient
import os

# ---------------- ROBOFLOW CLIENT ----------------
# ⚠️ For now use direct key (later move to .env)
CLIENT = InferenceHTTPClient(
    api_url="https://serverless.roboflow.com",
    api_key="qQGaVmAGn3lPPWwb5gZH"   # ✅ FIXED (no getenv issue)
)

# ---------------- MAIN FUNCTION ----------------
def detect_injury_and_severity(image_path):

    print("\n🔥 Injury function called")
    print("📂 Image path:", image_path)

    try:
        # -------- CALL ROBOFLOW --------
        result = CLIENT.infer(
            image_path,
            model_id="dataset-2-injury-classifier-nouqt-s8sql/1"
        )

        print("✅ ROBOFLOW RAW RESULT:", result)

        predictions = result.get("predictions", [])

        # -------- NO PREDICTIONS --------
        if not predictions:
            print("⚠️ No predictions returned from model")

            return {
                "injury_status": "unknown",
                "confidence": 0,
                "severity": "unknown"
            }

        # -------- TOP PREDICTION --------
        top_pred = predictions[0]

        label = top_pred.get("class", "unknown").lower()
        confidence = round(top_pred.get("confidence", 0), 2)

        print(f"🎯 Prediction → {label} ({confidence})")

        # -------- SIMPLE LOGIC --------
        if label == "healthy":
            return {
                "injury_status": "healthy",
                "confidence": confidence,
                "severity": "none"
            }

        elif label == "injured":
            return {
                "injury_status": "injured",
                "confidence": confidence,
                "severity": "moderate"
            }

        # -------- FALLBACK --------
        return {
            "injury_status": label,
            "confidence": confidence,
            "severity": "unknown"
        }

    except Exception as e:
        print("❌ ROBOFLOW ERROR:", str(e))

        return {
            "error": str(e),
            "injury_status": "unknown",
            "severity": "unknown"
        }