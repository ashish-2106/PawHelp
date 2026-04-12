from flask import Blueprint, request, jsonify
import os
from werkzeug.utils import secure_filename

# AI services
from services.species_service import detect_species
from services.injury_service import detect_injury_and_severity
from services.first_aid_service import generate_first_aid

# database
from services.store import save_report

report_bp = Blueprint("report", __name__)

# ---------------- CONFIG ----------------
UPLOAD_FOLDER = "uploads"
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg"}

# ---------------- HELPERS ----------------
def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

# ---------------- GET TEST ----------------
@report_bp.route("", methods=["GET"])
def report_page():
    return jsonify({"message": "Use POST /report with image, lat, lng"})

# ---------------- POST MAIN API ----------------
@report_bp.route("", methods=["POST"])
def report_animal():

    try:
        print("\n🚀 NEW REPORT REQUEST RECEIVED")

        # -------- DEBUG FORM --------
        print("📦 FORM DATA:", request.form)

        # -------- GET USER ID --------
        user_id = request.form.get("user_id")
        print("👤 USER ID:", user_id)

        if not user_id:
            return jsonify({"error": "user_id missing"}), 400

        try:
            user_id = int(user_id)
        except:
            return jsonify({"error": "Invalid user_id"}), 400

        # -------- VALIDATION --------
        if "image" not in request.files:
            return jsonify({"error": "Image not provided"}), 400

        image = request.files["image"]
        lat = request.form.get("lat")
        lng = request.form.get("lng")

        if image.filename == "":
            return jsonify({"error": "No selected file"}), 400

        if not lat or not lng:
            return jsonify({"error": "Latitude and Longitude required"}), 400

        if not allowed_file(image.filename):
            return jsonify({"error": "Invalid image format"}), 400

        # -------- SAVE IMAGE --------
        if not os.path.exists(UPLOAD_FOLDER):
            os.makedirs(UPLOAD_FOLDER)

        filename = secure_filename(image.filename)
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        filepath = filepath.replace("\\", "/")

        image.save(filepath)
        print("📂 Image saved at:", filepath)

        # -------- AI: SPECIES DETECTION --------
        print("🐾 Running species detection...")
        species_detections = detect_species(filepath)

        print("✅ Species result:", species_detections)

        if not species_detections:
            return jsonify({"error": "Unable to detect animal species"}), 200

        top_species = species_detections[0].get("species", "unknown")
        print("🎯 Top species:", top_species)

        # -------- OPTIONAL (future crop support) --------
        cropped_path = species_detections[0].get("crop_path", filepath)
        print("✂️ Using image for injury detection:", cropped_path)

        # -------- AI: INJURY DETECTION --------
        print("🩺 Running injury detection...")
        injury_result = detect_injury_and_severity(cropped_path)

        print("✅ Injury result:", injury_result)

        injury_type = injury_result.get("injury_status", "Unknown")
        severity = injury_result.get("severity", "Unknown")

        # -------- AI: FIRST AID --------
        print("🧠 Generating first aid...")
        first_aid = generate_first_aid(
            species=top_species,
            injury_type=injury_type,
            severity=severity
        )

        # -------- PREPARE DATA --------
        report_data = {
            "user_id": user_id,   # ✅ FIXED
            "species": top_species,
            "injury_type": injury_type,
            "severity": severity,
            "latitude": lat,
            "longitude": lng,
            "image_path": filepath,
            "status": "PENDING"
        }

        # -------- SAVE TO DATABASE --------
        print("💾 Saving report to DB...")
        report_id = save_report(report_data)

        # -------- RESPONSE --------
        print("✅ REPORT COMPLETED SUCCESSFULLY\n")

        return jsonify({
            "message": "Animal report received successfully",
            "report_id": report_id,
            "location": {
                "latitude": lat,
                "longitude": lng
            },
            "image_path": filepath,
            "species_detections": species_detections,
            "injury_analysis": injury_result,
            "first_aid": first_aid,
            "status": "PENDING"
        }), 200

    except Exception as e:
        print("❌ REPORT ERROR:", str(e))
        return jsonify({"error": str(e)}), 500