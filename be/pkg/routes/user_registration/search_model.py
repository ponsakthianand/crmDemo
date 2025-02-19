from pydantic import BaseModel, EmailStr
from typing import List, Optional, Union, Dict, Any


class UserModel(BaseModel):
    id: str
    email: Optional[EmailStr] = None
    name: Optional[str] = None


class MemberModel(BaseModel):
    id: str
    partner_user_id: Optional[str] = None
    email: Optional[EmailStr] = None
    name: Optional[str] = None
    phone: Optional[str] = None


class CustomerModel(BaseModel):
    id: str
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None


class TicketModel(BaseModel):
    id: str
    title: Optional[str] = None
    description: Optional[str] = None


class SearchResultModel(BaseModel):
    users: List[UserModel] = []
    members: List[MemberModel] = []
    customers: List[CustomerModel] = []
    tickets: List[TicketModel] = []
