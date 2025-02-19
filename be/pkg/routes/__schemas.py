# _schemas.py
from pydantic import BaseModel
from typing import List, Optional


class SuperAdminCreate(BaseModel):
    username: str
    password: str


class PartnerCreate(BaseModel):
    name: str


class CustomerCreate(BaseModel):
    name: str
    partner_id: Optional[str] = None


class SuperAdmin(BaseModel):
    id: str
    username: str

    class Config:
        orm_mode = True


class Partner(BaseModel):
    id: str
    name: str

    class Config:
        orm_mode = True


class Customer(BaseModel):
    _id: str
    name: str
    partner_id: str

    class Config:
        orm_mode = True
