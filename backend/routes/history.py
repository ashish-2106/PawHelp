from flask import Blueprint, request, jsonify
from db import get_db

history_bp = Blueprint("history", __name__)

# -------- GET USER REPORTS --------
@history_bp.route("/my-reports", methods=["GET"])
def get_my_reports():
    try:
        user_id = request.args.get("user_id")

        if not user_id:
            return jsonify({"error": "user_id required"}), 400

        conn = get_db()
        cur = conn.cursor()

        cur.execute("""
            SELECT 
                id,
                species,
                injury_type,
                severity,
                latitude,
                longitude,
                image_path,
                status,
                created_at
            FROM reports
            WHERE user_id = %s
            ORDER BY created_at DESC
        """, (user_id,))

        rows = cur.fetchall()
        conn.close()

        reports = []

        for r in rows:
            reports.append({
                "id": str(r[0]),
                "species": r[1],
                "injury_type": r[2],
                "severity": r[3],
                "latitude": r[4],
                "longitude": r[5],
                "image_path": r[6],
                "status": r[7],
                "created_at": str(r[8])
            })

        return jsonify({"reports": reports})

    except Exception as e:
        print("❌ ERROR fetching reports:", str(e))
        return jsonify({"error": "Server error"}), 500