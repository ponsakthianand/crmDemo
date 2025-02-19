from fastapi import FastAPI, WebSocket, WebSocketDisconnect, APIRouter
from typing import List
from pydantic import BaseModel
import json

from starlette import status

from pkg.database.database import database
import uuid
from datetime import datetime
import logging

websocket_router = APIRouter()
chat_collection = database.get_collection("socket_chat")

class ConnectionManager:
    def __init__(self):
        # Dictionary to hold connections per chat_id
        self.active_connections: Dict[str, List[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, chat_id: str):
        await websocket.accept()

        # Add the websocket connection to the correct chat room
        if chat_id not in self.active_connections:
            self.active_connections[chat_id] = []
        self.active_connections[chat_id].append(websocket)

    def disconnect(self, websocket: WebSocket, chat_id: str):
        # Remove the connection from the chat room
        if chat_id in self.active_connections:
            self.active_connections[chat_id].remove(websocket)

            # Clean up if no connections left in the chat room
            if len(self.active_connections[chat_id]) == 0:
                del self.active_connections[chat_id]

    async def send_message(self, message: str, websocket: WebSocket):
        try:
            await websocket.send_text(message)
        except RuntimeError:
            # WebSocket is already closed, ignore or log the error
            print(f"Failed to send message to closed WebSocket: {message}")

    async def broadcast(self, message: str, chat_id: str):
        # Broadcast to all clients in the specified chat room
        if chat_id in self.active_connections:
            for connection in self.active_connections[chat_id]:
                try:
                    await connection.send_text(message)
                except RuntimeError:
                    # WebSocket is already closed, ignore or log the error
                    print(f"Failed to broadcast message to closed WebSocket: {message}")


manager = ConnectionManager()


async def save_message_to_mongodb(client_id: int, chat_id: str, message: str):
    message_data = {
        "client_id": client_id,
        "chat_id": chat_id,
        "message": message,
        "timestamp": datetime.utcnow()  # Store the current time in UTC format
    }

    # Update the chat document, or create one if it doesn't exist
    chat_collection.update_one(
        {"chat_id": chat_id},  # Find the document by chat_id
        {
            # Add the new message to the 'messages' array
            "$push": {"messages": message_data},
            # Create the document if it doesn't exist
            "$setOnInsert": {
                "chat_id": chat_id,
                "created_at": datetime.utcnow(),  # Store the creation time for the chat
            }
        },
        upsert=True  # Insert if chat_id doesn't exist
    )


@websocket_router.websocket("/ws/{chat_id}/{client_id}")
async def websocket_endpoint(websocket: WebSocket, chat_id: str, client_id: int):
    await manager.connect(websocket, chat_id)
    try:
        while True:
            # Receive message from client
            data = await websocket.receive_text()

            # Send message back to the sender
            await manager.send_message(f"You (Client {client_id}) wrote: {data}", websocket)

            # Broadcast message to all clients in the chat (including the sender)
            await manager.broadcast(f"Chat {chat_id} - Client {client_id} says: {data}", chat_id)

            # Save the message to MongoDB
            await save_message_to_mongodb(client_id, chat_id, data)
    except WebSocketDisconnect:
        manager.disconnect(websocket, chat_id)
        await manager.broadcast(f"Client {client_id} disconnected from Chat {chat_id}.", chat_id)

    # try:
    #     while True:
    #         # Receive message from WebSocket
    #         data = await websocket.receive_text()
    #         logging.info(f"Received message from {user_id}: {data}")
    #
    #         # Create a chat message document to store in MongoDB
    #         chat_message = {
    #             "user_id": user_id,
    #             "chat_id": chat_id,
    #             "message": data,
    #             "timestamp": datetime.utcnow()
    #         }

    # try:
    #     # Append message to the existing chat document or create it if it doesn't exist
    #     chat_collection.update_one(
    #         {"chat_id": chat_id},
    #         {
    #             "$push": {"messages": chat_message},
    #             "$setOnInsert": {
    #                 "chat_id": chat_id,
    #                 "created_at": datetime.utcnow()
    #             }
    #         },
    #         upsert=True
    #     )
    #     logging.info(f"Message appended to chat {chat_id}.")
    # except Exception as e:
    #     logging.error(f"Error updating chat {chat_id} in MongoDB: {e}")

    # Send the received data to other users in the same chat
    # for user, user_ws in connected_users.items():
    #     if user != user_id:
    #         await user_ws.send_text(data)
    #
    # except WebSocketDisconnect:
    #     logging.info(f"User {user_id} disconnected.")
    #     del connected_users[user_id]
    #     await websocket.close()
    # except Exception as e:
    #     logging.error(f"Error in WebSocket handling: {e}")
    #     del connected_users[user_id]
    #     await websocket.close()

# async def websocket_endpoint(user_id: str, chat_id: str, websocket: WebSocket):
#     try:
#         logging.info(f"Attempting WebSocket connection: User {user_id}, Chat {chat_id}")
#         await websocket.accept()
#         # Rest of the WebSocket code...
#     except Exception as e:
#         logging.error(f"WebSocket connection rejected: {e}")
#         await websocket.close(code=status.WS_1008_POLICY_VIOLATION)

# @websocket_router.websocket("/ws/chat/{user_id}/{chat_id}")
# @websocket_router.websocket("/ws/{user_id}")
# async def websocket_endpoint(user_id: str, websocket: WebSocket):
#     await websocket.accept()
#
#     # Store the WebSocket connection in the dictionary
#     connected_users[user_id] = websocket
#
#     try:
#         while True:
#             data = await websocket.receive_text()
#             # Send the received data to the other user
#             for user, user_ws in connected_users.items():
#                 if user != user_id:
#                     await user_ws.send_text(data)
#     except:
#         # If a user disconnects, remove them from the dictionary
#         del connected_users[user_id]
#         await websocket.close()

# async def websocket_endpoint(user_id, chat_id, websocket: WebSocket):
#     await manager.connect(websocket)
#     connected_users[user_id] = websocket
#     try:
#         while True:
#             data = await websocket.receive_text()
#             await manager.broadcast(f"Client says: {data}")
#             # Create or update the conversation in MongoDB
#             chat_message = {
#                 "user_id": user_id,
#                 "message": data,
#                 "timestamp": datetime.utcnow()
#             }
#             try:
#                 # Append message to the existing chat document, or create it if it doesn't exist
#                 chat_collection.update_one(
#                     {"chat_id": chat_id},
#                     {
#                         "$push": {"messages": chat_message},
#                         "$setOnInsert": {
#                             "chat_id": chat_id,
#                             "created_at": datetime.utcnow()
#                         }
#                     },
#                     upsert=True
#                 )
#                 logging.info(f"Message appended to chat {chat_id}.")
#             except Exception as e:
#                 logging.error(f"Error updating chat {chat_id} in MongoDB: {e}")
#
#             # Send the received data to other users in the same chat
#             for user, user_ws in connected_users.items():
#                 if user != user_id:
#                     await user_ws.send_text(data)
#     except WebSocketDisconnect:
#         manager.disconnect(websocket)
#         await manager.broadcast("Client left the chat")
