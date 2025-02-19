from bson import ObjectId
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


# Pydantic models
class TicketCreate(BaseModel):
    title: str
    description: str


class AssignTicket(BaseModel):
    role: Optional[str] = None
    partner_id: str
    ticket_id: str


class Ticket(BaseModel):
    id: Optional[str] = Field(default=None, alias="_id")
    ticketId: Optional['str'] = 1
    title: str
    description: str
    customer: Optional['str'] = None
    customer_name: Optional[str] = None
    admin_name: Optional[str] = None
    partner_name: Optional[str] = None
    partner: Optional[str] = None
    admin: Optional[str] = None
    status: str = "open"
    created_at: datetime = Field(default_factory=datetime.now)
    current_status: Optional[str] = None
    last_message: Field(default_factory=dict) = {}
    category: Optional[str] = None
    priority: Optional[str] = None

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True


class ChatMessageCreate(BaseModel):
    content: str


class FileMetadata(BaseModel):
    file_id: str
    file_name: str


class ChatMessage(BaseModel):
    id: Optional[str] = Field(default=None, alias="_id")
    ticket_id: str
    sender_id: Optional[str] = None
    content: str
    receiver_id: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.now)
    sender_name: Optional[str] = None
    receiver_name: Optional[str] = None
    files: Optional[List[FileMetadata]] = []

    # file_id: Optional[str] = None
    # file_name: Optional[str] = None

    class Config:
        allow_population_by_field_name = True


class CloseTicket(BaseModel):
    id: Optional[str] = Field(default=None, alias="_id")
    ticket_id: str
    content: str
    created_at: datetime = Field(default_factory=datetime.now)
    current_status: Optional[str] = None
    status: str
    close_description: str
    closed_by: str
    role: str
    resolved_date: Optional[datetime]




class TicketUpdateModel(BaseModel):
    status: Optional[str] = None
    category: Optional[str] = None
    priority: Optional[str] = None



class CategoryCreateModel(BaseModel):
    category: str


class PriorityCreateModel(BaseModel):
    priority: str
