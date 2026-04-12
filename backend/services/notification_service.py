from services.twilio_service import send_sms
from services.store import get_all_ngos

def notify_ngos(report):

    ngos = get_all_ngos()

    message = f"""
🚨 PawHelp Rescue Alert

Animal: {report['animal']}
Injury: {report['injury']}
Location: {report['location']}

Please check the NGO dashboard.
"""

    for ngo in ngos:
        if ngo.get("phone"):
            send_sms(ngo["phone"], message)