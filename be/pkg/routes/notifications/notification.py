from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException

from pkg.routes.authentication import val_token
from pkg.database.database import database

notification_router = APIRouter()
notifications_collection = database.get_collection('notifications')


@notification_router.put("/notifications/{notification_id}/read")
async def mark_notification_as_read(notification_id: str, token: str = Depends(val_token)):
    if token[0] is True:
        user_details = token[1]
        user_id = user_details['id']

        # Update the notification status to "read"
        notifications_collection.update_one(
            {"_id": ObjectId(notification_id), "user_id": str(user_id)},
            {"$set": {"status": "read"}}
        )

        return {"message": "Notification marked as read"}
    else:
        raise HTTPException(status_code=401, detail=token[1])


@notification_router.get("/notifications")
async def get_notifications(token: str = Depends(val_token)):
    if token[0] is True:
        user_details = token[1]
        user_id = user_details['id']

        # Fetch unread notifications for the user
        notifications = list(notifications_collection.find({"user_id": str(user_id), "status": "unread"}))

        # Convert ObjectId to string for JSON serialization
        for notification in notifications:
            notification["_id"] = str(notification["_id"])
            notification["created_at"] = str(notification["created_at"])

        return {"notifications": notifications}
    else:
        raise HTTPException(status_code=401, detail=token[1])

