from db import get_db

try:
    conn = get_db()
    cur = conn.cursor()
    cur.execute("SELECT 1;")
    print("✅ Supabase DB connected successfully")
    conn.close()
except Exception as e:
    print("❌ DB connection failed")
    print(e)
