from datetime import datetime
from typing import Optional

from pydantic import BaseModel
from enum import Enum


class MFRequest(BaseModel):
    id : Optional[str] = None
    admin_id: str
    customer_id: str
    mftype: Optional[str] = None
    amount: float
    frequency: Optional[str] = None
    status: Optional[str] = "review"
    start_from: Optional[datetime] = ''
    requested_by: str
    description: Optional[str] = None
    process_status: Optional[str] = None


class MFAccount(BaseModel):
    fund_name: str
    amount: float


class EditMfprocess(BaseModel):
    id : Optional[str] = None
    mftype: Optional[str] = None
    amount: Optional[str] = None
    frequency: Optional[str] = None
    start_from: Optional[datetime] = ''
    requested_by: Optional[str] = None
    description: Optional[str] = None
    process_status: Optional[str] = None