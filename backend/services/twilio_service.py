import os
from twilio.rest import Client
from dotenv import load_dotenv

load_dotenv() # this loads .env file

account_sid = os.getenv("TWILIO_ACCOUNT_SID")
auth_token = os.getenv("TWILIO_AUTH_TOKEN")

client = Client(account_sid, auth_token)

TWILIO_PHONE = "+12708122351" # your twilio number

def send_sms(to_number, message):
    try:
        client.messages.create(
            body=message,
            from_=TWILIO_PHONE,
            to=to_number
        )
        print("SMS sent to", to_number)

    except Exception as e:
        print("SMS error:", e)
