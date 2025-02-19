import uuid
from datetime import datetime

from fastapi import FastAPI, WebSocket, APIRouter, WebSocketDisconnect
from pkg.database.database import database

socket_router = APIRouter()
connected_users = {}

chat_collection = database.get_collection("socket_chat")
result = chat_collection.create_index(
    [("created_at", 1)],  # Index on 'created_at' field, ascending order
    expireAfterSeconds=86400  # 24 hours
)
#
# @socket_router.websocket("/ws/{user_id}")
# async def websocket_endpoint(user_id: str, websocket: WebSocket):
#     await websocket.accept()
#
#     # Store the WebSocket connection in the dictionary
#     connected_users[user_id] = websocket
#
#     try:
#         while True:
#             data = await websocket.receive_text()
#
#             # Save the received message to MongoDB
#             chat_message = {
#                 "user_id": user_id,
#                 "message": data,
#                 "timestamp": datetime.utcnow()
#             }
#
#             # Send the received data to the other users
#             for user, user_ws in connected_users.items():
#                 if user != user_id:
#                     print(data)
#                     await user_ws.send_text(data)
#                     # await chat_collection.insert_one(chat_message)
#     except Exception as e:
#         # If a user disconnects, remove them from the dictionary
#         del connected_users[user_id]
#         await websocket.close()
import logging


##@socket_router.websocket("/ws/{user_id}/{chat_id}")
async def websocket_endpoint(user_id: str, chat_id: str, websocket: WebSocket):
    await websocket.accept()
    connected_users[user_id] = websocket
    logging.info(f"User {user_id} connected to chat {chat_id}.")

    try:
        while True:
            # Receive message from WebSocket
            data = await websocket.receive_text()
            logging.info(f"Received message from {user_id}: {data}")

            # Create or update the conversation in MongoDB
            chat_message = {
                "user_id": user_id,
                "message": data,
                "timestamp": datetime.utcnow()
            }
            try:
                # Append message to the existing chat document, or create it if it doesn't exist
                chat_collection.update_one(
                    {"chat_id": chat_id},
                    {
                        "$push": {"messages": chat_message},
                        "$setOnInsert": {
                            "chat_id": chat_id,
                            "created_at": datetime.utcnow()
                        }
                    },
                    upsert=True
                )
                logging.info(f"Message appended to chat {chat_id}.")
            except Exception as e:
                logging.error(f"Error updating chat {chat_id} in MongoDB: {e}")

            # Send the received data to other users in the same chat
            for user, user_ws in connected_users.items():
                if user != user_id:
                    await user_ws.send_text(data)
    except Exception as e:
        logging.error(f"Error in WebSocket handling: {e}")
    finally:
        # If a user disconnects, remove them from the dictionary
        del connected_users[user_id]
        logging.info(f"User {user_id} disconnected.")
        await websocket.close()


# Helper function to create a unique chat ID
def create_unique_chat_id():
    return str(uuid.uuid4())

