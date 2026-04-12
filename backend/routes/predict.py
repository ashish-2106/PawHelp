from flask import Blueprint, request, jsonify
import os
from werkzeug.utils import secure_filename
from services.species_service import detect_species

predict_bp = Blueprint("predict", __name__)

UPLOAD_FOLDER = "uploads"
ALLOWED_EXTENSIONS = {"jpg", "jpeg", "png"}

def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


@predict_bp.route("/species", methods=["POST"])
def predict_species():
    if "image" not in request.files:
        return jsonify({"error": "Image not provided"}), 400

    image = request.files["image"]

    if image.filename == "":
        return jsonify({"error": "No image selected"}), 400

    if not allowed_file(image.filename):
        return jsonify({"error": "Invalid file type"}), 400

    if not os.path.exists(UPLOAD_FOLDER):
        os.makedirs(UPLOAD_FOLDER)

    filename = secure_filename(image.filename)
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    image.save(filepath)

    detections = detect_species(filepath)

    return jsonify({
        "message": "Species detection successful",
        "detections": detections
    })
