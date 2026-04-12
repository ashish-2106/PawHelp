from flask import Blueprint, request, jsonify
from db import get_db

ngo_bp = Blueprint("ngo", __name__)


# --------------------------------------------------
# NGO APPLY
# --------------------------------------------------
@ngo_bp.route("/apply", methods=["POST"])
def apply_ngo():

    data = request.json

    user_id = data["user_id"]
    ngo_name = data["ngo_name"]
    registration_number = data.get("registration_number")
    description = data.get("description")
    contact_person = data.get("contact_person")
    phone = data["phone"]
    email = data["email"]
    address = data.get("address")
    city = data.get("city")
    state = data.get("state")
    pincode = data.get("pincode")
    latitude = data.get("latitude")
    longitude = data.get("longitude")
    service_radius_km = data.get("service_radius_km")

    conn = get_db()
    cur = conn.cursor()

    # Prevent duplicate application
    cur.execute(
        "SELECT id FROM ngo_profiles WHERE user_id=%s",
        (user_id,)
    )

    if cur.fetchone():
        conn.close()
        return jsonify({"error": "NGO application already exists"}), 400

    # Insert NGO (PENDING)
    cur.execute(
        """
        INSERT INTO ngo_profiles (
            user_id,
            ngo_name,
            registration_number,
            description,
            contact_person,
            phone,
            email,
            address,
            city,
            state,
            pincode,
            latitude,
            longitude,
            service_radius_km,
            status
        )
        VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,'PENDING')
        """,
        (
            user_id,
            ngo_name,
            registration_number,
            description,
            contact_person,
            phone,
            email,
            address,
            city,
            state,
            pincode,
            latitude,
            longitude,
            service_radius_km
        )
    )

    conn.commit()
    conn.close()

    return jsonify({"message": "NGO application submitted successfully"}), 201


# --------------------------------------------------
# ADMIN: GET NGOS BY STATUS (FULL DATA)
# --------------------------------------------------
@ngo_bp.route("/<status>", methods=["GET"])
def get_ngos_by_status(status):

    status = status.upper()

    if status not in ["PENDING", "APPROVED", "REJECTED"]:
        return jsonify({"error": "Invalid status"}), 400

    conn = get_db()
    cur = conn.cursor()

    cur.execute(
        """
        SELECT
            id,
            ngo_name,
            registration_number,
            description,
            contact_person,
            phone,
            email,
            address,
            city,
            state,
            pincode,
            latitude,
            longitude,
            service_radius_km,
            status
        FROM ngo_profiles
        WHERE status=%s
        ORDER BY id DESC
        """,
        (status,)
    )

    ngos = cur.fetchall()
    conn.close()

    result = []

    for n in ngos:
        result.append({
            "id": n[0],
            "ngo_name": n[1],
            "registration_number": n[2],
            "description": n[3],
            "contact_person": n[4],
            "phone": n[5],
            "email": n[6],
            "address": n[7],
            "city": n[8],
            "state": n[9],
            "pincode": n[10],
            "latitude": n[11],
            "longitude": n[12],
            "service_radius_km": n[13],
            "status": n[14],
        })

    return jsonify(result)


# --------------------------------------------------
# ADMIN: APPROVE NGO (AUTO ROLE UPDATE)
# --------------------------------------------------
@ngo_bp.route("/approve/<int:ngo_id>", methods=["POST"])
def approve_ngo(ngo_id):

    conn = get_db()
    cur = conn.cursor()

    cur.execute(
        """
        UPDATE ngo_profiles
        SET status='APPROVED'
        WHERE id=%s
        RETURNING user_id
        """,
        (ngo_id,)
    )

    row = cur.fetchone()

    if not row:
        conn.close()
        return jsonify({"error": "NGO not found"}), 404

    user_id = row[0]

    # Promote user to NGO role
    cur.execute(
        "UPDATE users SET role='NGO' WHERE id=%s",
        (user_id,)
    )

    conn.commit()
    conn.close()

    return jsonify({"message": "NGO approved successfully"})


# --------------------------------------------------
# ADMIN: REJECT NGO
# --------------------------------------------------
@ngo_bp.route("/reject/<int:ngo_id>", methods=["POST"])
def reject_ngo(ngo_id):

    conn = get_db()
    cur = conn.cursor()

    cur.execute(
        "UPDATE ngo_profiles SET status='REJECTED' WHERE id=%s",
        (ngo_id,)
    )

    conn.commit()
    conn.close()

    return jsonify({"message": "NGO rejected successfully"})


# --------------------------------------------------
# NGO DASHBOARD: GET RESCUE REQUESTS
# --------------------------------------------------
@ngo_bp.route("/requests", methods=["GET"])
def get_ngo_requests():

    conn = get_db()
    cur = conn.cursor()

    # ✅ IMPORTANT: include ACCEPTED also
    cur.execute(
        """
        SELECT id, species, injury_type, latitude, longitude, image_path, status
        FROM reports
        WHERE status IN ('PENDING','ACCEPTED')
        ORDER BY created_at DESC
        """
    )

    rows = cur.fetchall()
    conn.close()

    requests = []

    for r in rows:
        requests.append({
            "id": r[0],
            "animal": r[1],
            "condition": r[2],
            "latitude": r[3],
            "longitude": r[4],
            "image_path": r[5],
            "status": r[6],   # ✅ include status
        })

    return jsonify({"requests": requests})


# --------------------------------------------------
# NGO DASHBOARD: ACCEPT REQUEST (UUID FIXED)
# --------------------------------------------------
@ngo_bp.route("/accept/<request_id>", methods=["GET"])
def accept_request(request_id):

    conn = get_db()
    cur = conn.cursor()

    try:
        cur.execute(
            """
            UPDATE reports
            SET status='ACCEPTED'
            WHERE id=%s
            """,
            (request_id,)
        )

        conn.commit()

        return jsonify({
            "message": f"Request {request_id} accepted successfully"
        })

    except Exception as e:
        print("❌ ERROR accepting request:", str(e))
        return jsonify({"error": "Server error"}), 500

    finally:
        conn.close()


# --------------------------------------------------
# NGO DASHBOARD: MARK AS RESCUED
# --------------------------------------------------
@ngo_bp.route("/rescue/<request_id>", methods=["GET"])
def mark_rescued(request_id):

    conn = get_db()
    cur = conn.cursor()

    try:
        cur.execute(
            """
            UPDATE reports
            SET status='RESCUED'
            WHERE id=%s
            """,
            (request_id,)
        )

        conn.commit()

        return jsonify({
            "message": f"Request {request_id} marked as rescued"
        })

    except Exception as e:
        print("❌ ERROR rescuing request:", str(e))
        return jsonify({"error": "Server error"}), 500

    finally:
        conn.close()