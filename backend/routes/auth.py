from flask import Blueprint, request, jsonify
from db import get_db

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json
    firebase_uid = data["uid"]
    email = data["email"]

    conn = get_db()
    cur = conn.cursor()

    # ---------------- CHECK USER ----------------
    cur.execute(
        "SELECT id, role FROM users WHERE firebase_uid=%s",
        (firebase_uid,)
    )
    user = cur.fetchone()

    # ---------------- FIRST LOGIN ----------------
    if not user:
        cur.execute(
            """
            INSERT INTO users (firebase_uid, email, role)
            VALUES (%s, %s, 'USER')
            RETURNING id
            """,
            (firebase_uid, email)
        )
        user_id = cur.fetchone()[0]
        conn.commit()
        conn.close()

        return jsonify({
            "role": "USER",
            "user_id": user_id,
            "ngo_status": None
        })

    # ---------------- EXISTING USER ----------------
    user_id, role = user
    ngo_status = None

    # ---------------- NGO STATUS CHECK ----------------
    if role == "NGO":
        cur.execute(
            "SELECT status FROM ngo_profiles WHERE user_id=%s",
            (user_id,)
        )
        ngo = cur.fetchone()
        ngo_status = ngo[0] if ngo else None

    conn.close()

    return jsonify({
        "role": role,
        "user_id": user_id,
        "ngo_status": ngo_status
    })
