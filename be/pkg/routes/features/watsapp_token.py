from fastapi import FastAPI, HTTPException, APIRouter
from pydantic import BaseModel
import json
from dotenv import load_dotenv
from twilio.base.exceptions import TwilioRestException

from config.config import settings
from twilio.rest import Client

# Load environment variables from a .env file
load_dotenv()

# Twilio API credentials (replace or store in .env file)
TWILIO_ACCOUNT_SID = settings.TWILIO_ACCOUNT_SID
TWILIO_AUTH_TOKEN = settings.TWILIO_AUTH_TOKEN
TWILIO_MESSAGING_SERVICE_SID = settings.TWILIO_MESSAGING_SERVICE_SID

# Base URL for Twilio API
watsapp_router = APIRouter()


# Request body schema
class WhatsAppMessage(BaseModel):
    to: str  # WhatsApp recipient in the format 'whatsapp:+1234567890'
    content_sid: str  # Content SID
    content_variables: dict  # Content variables to replace placeholders


@watsapp_router.post("/send-whatsapp")
async def send_whatsapp(message: WhatsAppMessage):
    """
    Send a WhatsApp message using Twilio API.
    """
    try:
        # Send the request to Twilio API
        client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)

        response = client.messages.create(
            to=f"whatsapp:{message.to}",
            from_="whatsapp:+19093414369",  # Replace with your Twilio WhatsApp-enabled number
            content_sid=message.content_sid,
            content_variables=json.dumps(message.content_variables),
            messaging_service_sid=TWILIO_MESSAGING_SERVICE_SID)
        # Check for successful response
        return {
            "status": "success",
            "data": {
                "sid": response.sid,
                "status": response.status,
                "to": response.to,
                "from_": response.from_,
                "date_created": str(response.date_created),
                "date_sent": str(response.date_sent),
                "date_updated": str(response.date_updated),
                "error_code": response.error_code,
                "error_message": response.error_message,
            },
        }

    except TwilioRestException as e:
        # raise HTTPException(status_code=500, detail=json.dumps(e))
        return {"status": "Failed", "data": e}
