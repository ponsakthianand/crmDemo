from datetime import date, datetime, time, timedelta
from typing import List, Optional
from pydantic import BaseModel, EmailStr, constr
from bson.objectid import ObjectId


class FileMetadata(BaseModel):
    file_id: str
    file_name: str


class Customer(BaseModel):
    name: str
    email: str
    phone: str
    photo: Optional[List[FileMetadata]] = []
    partner_id: Optional[list] or None = []
    created_at: datetime or None or ''
    role: str or None = None
    secondary_contact: Optional[str] or None = None
    gender: Optional[str] or None = None
    date_of_birth: Optional[str] or None = None
    address: Optional[str] or None = None
    annual_income: Optional[int] or None = None
    source_of_income: Optional[str] or None = None
    marital_status: Optional[str] or None = None
    pan_number: Optional[str] or None = None
    aadhaar_number: Optional[str] or None = None
    no_of_dependants: Optional[str] or None = None
    current_city: Optional[str] or None = None
    educational_qualification: Optional[str] or None = None
    permanent_address: Optional[str] or None = None
    nominee_name: Optional[str] or None = None
    nominee_relationship: Optional[str] or None = None
    nominee_dob: Optional[str] or None = None


class EditCustomer(BaseModel):
    name: Optional[str] or None = None
    email: str
    photo: Optional[List[FileMetadata]] = []
    phone: Optional[str] or None = None
    partner_id: Optional[list] or None = []
    secondary_contact: Optional[str] or None = None
    gender: Optional[str] or None = None
    date_of_birth: Optional[str] or None = None
    address: Optional[str] or None = None
    annual_income: Optional[int] or None = None
    source_of_income: Optional[str] or None = None
    marital_status: Optional[str] or None = None
    pan_number: Optional[str] or None = None
    aadhaar_number: Optional[str] or None = None
    no_of_dependants: Optional[str] or None = None
    current_city: Optional[str] or None = None
    educational_qualification: Optional[str] or None = None
    permanent_address: Optional[str] or None = None
    nominee_name: Optional[str] or None = None
    nominee_relationship: Optional[str] or None = None
    nominee_dob: Optional[str] or None = None


class LoginCustomerSchema(BaseModel):
    email: EmailStr
    password: constr(min_length=8)
    partner_id: list or None = None


class PartnerResponse(BaseModel):
    id: str
    name: str
    email: str
    role: Optional[str]
    phone: Optional[str]
    created_at: Optional[str]
    partner_user_id: Optional[str]


class CustomerResponse(BaseModel):
    id: str
    name: str
    email: str
    phone: Optional[str]
    created_at: str
    role: str
    photo: Optional[List[FileMetadata]] = []
    secondary_contact: Optional[str] = None
    gender: Optional[str] = None
    date_of_birth: Optional[str] = None
    address: Optional[str] = None
    annual_income: Optional[int] = None
    source_of_income: Optional[str] = None
    marital_status: Optional[str] = None
    pan_number: Optional[str] = None
    aadhaar_number: Optional[str] = None
    no_of_dependants: Optional[str] = None
    current_city: Optional[str] = None
    educational_qualification: Optional[str] = None
    permanent_address: Optional[str] = None
    nominee_name: Optional[str] = None
    nominee_relationship: Optional[str] = None
    nominee_dob: Optional[str] = None
    partner: Optional[PartnerResponse] = None


class AdminApprovalRequest(BaseModel):
    approve: bool


# Define the model for password reset
class PasswordResetRequest(BaseModel):
    email: str
    current_password: str
    new_password: str


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class VerifyOtpRequest(BaseModel):
    email: EmailStr
    otp: str
    new_password: str


class AssignCustomer(BaseModel):
    partner_user_id: str
    customer_id: str