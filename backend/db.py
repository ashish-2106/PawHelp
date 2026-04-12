import psycopg2

def get_db():
    return psycopg2.connect(
        host="aws-1-ap-south-1.pooler.supabase.com",
        database="postgres",
        user="postgres.fnbjtyyidijeybxowrrr",
        password="Pawhelp2106200",
        port=5432,
        sslmode="require"
    )
