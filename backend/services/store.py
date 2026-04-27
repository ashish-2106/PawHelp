from db import get_db


# -------- SAVE REPORT --------
def save_report(report_data):
    conn = get_db()
    cursor = conn.cursor()

    try:
        # ✅ Validate required fields
        if "user_id" not in report_data or not report_data["user_id"]:
            raise ValueError("user_id is required")

        # Optional safety checks
        report_data.setdefault("species", None)
        report_data.setdefault("injury_type", None)
        report_data.setdefault("severity", None)
        report_data.setdefault("latitude", None)
        report_data.setdefault("longitude", None)
        report_data.setdefault("image_path", None)
        report_data.setdefault("status", "PENDING")

        # ✅ SQL Query
        query = """
        INSERT INTO reports 
        (user_id, species, injury_type, severity, latitude, longitude, image_path, status)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        RETURNING id
        """

        values = (
            int(report_data["user_id"]),
            report_data["species"],
            report_data["injury_type"],
            report_data["severity"],
            report_data["latitude"],
            report_data["longitude"],
            report_data["image_path"],
            report_data["status"]
        )

        print("💾 Saving Report:", values)

        cursor.execute(query, values)

        report_id = cursor.fetchone()[0]
        conn.commit()

        print(f"✅ Report saved successfully with ID: {report_id}")

        return report_id

    except Exception as e:
        conn.rollback()
        print("❌ ERROR saving report:", str(e))
        raise e

    finally:
        cursor.close()
        conn.close()


# -------- GET ALL REPORTS --------
def get_all_reports():
    conn = get_db()
    cursor = conn.cursor()

    try:
        query = """
        SELECT 
            id,
            user_id,
            species,
            injury_type,
            severity,
            latitude,
            longitude,
            image_path,
            status,
            created_at
        FROM reports
        ORDER BY created_at DESC
        """

        cursor.execute(query)
        rows = cursor.fetchall()

        reports = []

        for row in rows:
            reports.append({
                "id": str(row[0]),
                "user_id": row[1],
                "species": row[2],
                "injury_type": row[3],
                "severity": row[4],
                "latitude": row[5],
                "longitude": row[6],
                "image_path": row[7],
                "status": row[8],
                "created_at": str(row[9])
            })

        return reports

    except Exception as e:
        print("❌ ERROR fetching reports:", str(e))
        return []

    finally:
        cursor.close()
        conn.close()


# -------- 🔥 GET ALL NGOS (NEW FUNCTION) --------
def get_all_ngos():
    conn = get_db()
    cursor = conn.cursor()

    try:
        query = """
        SELECT id, ngo_name, phone, latitude, longitude
        FROM ngo_profiles
        WHERE status = 'APPROVED'
        """

        cursor.execute(query)
        rows = cursor.fetchall()

        ngos = []

        for row in rows:
            ngos.append({
                "id": row[0],
                "name": row[1],        # ngo_name
                "phone": row[2],
                "latitude": row[3],
                "longitude": row[4]
            })

        print("📢 NGOs fetched:", ngos)

        return ngos

    except Exception as e:
        print("❌ ERROR fetching NGOs:", str(e))
        return []

    finally:
        cursor.close()
        conn.close()