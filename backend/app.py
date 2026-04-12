from flask import Flask, send_from_directory
from flask_cors import CORS
import os

# import routes
from routes.report import report_bp
from routes.predict import predict_bp
from routes.ngo import ngo_bp
from routes.auth import auth_bp
from routes.history import history_bp   # ✅ ADD THIS

app = Flask(__name__)
CORS(app)

# ---------------- CONFIG ----------------
UPLOAD_FOLDER = "uploads"

# Create uploads folder if it does not exist
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# ---------------- SERVE UPLOADED IMAGES ----------------
@app.route("/uploads/<path:filename>")
def serve_uploaded_file(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)

# ---------------- REGISTER BLUEPRINTS ----------------
app.register_blueprint(report_bp, url_prefix="/report")
app.register_blueprint(predict_bp, url_prefix="/predict")
app.register_blueprint(ngo_bp, url_prefix="/ngo")
app.register_blueprint(auth_bp, url_prefix="/auth")
app.register_blueprint(history_bp, url_prefix="/history")   # ✅ ADD THIS

# ---------------- ROOT ROUTE ----------------
@app.route("/")
def home():
    return {"status": "PawHelp Backend Running ✅"}

# ---------------- RUN SERVER ----------------
if __name__ == "__main__":
    app.run(debug=True)
    print(app.url_map)