from datetime import date, datetime, time, timedelta
from typing import List, Optional
from pydantic import BaseModel, EmailStr, constr
from bson.objectid import ObjectId


class FileMetadata(BaseModel):
    file_id: str
    file_name: str


class Members(BaseModel):
    name: str
    email: str
    role: str
    created_at: datetime
    phone: str
    partner_user_id: Optional[str]
    photo: Optional[List[FileMetadata]] = []
    status: str = "approved"
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


class EditMembers(BaseModel):
    name: Optional[str] = None
    email: str
    role: Optional[str] = None
    created_at: Optional[datetime] = None
    phone: Optional[str] = None
    photo: Optional[List[FileMetadata]] = []
    status: Optional[str] = "approved"
    partner_user_id: Optional[str]
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


class RequestModel(BaseModel):
    partner_id: str
    request_fields: List
    expiresAt: datetime
    created_time: datetime or None


class MemberBaseSchema(BaseModel):
    name: str
    email: str
    photo: Optional[List[FileMetadata]] = []
    phone: str
    status: str
    partner_user_id: Optional[str] = None
    organization_name: Optional[str] = None
    organization_type: Optional[str] = None
    description: Optional[str] = None
    role: str
    created_at: datetime or None = None
    updated_at: datetime or None = None
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


class CreateMemberSchema(MemberBaseSchema):
    password: constr(min_length=8)
    passwordConfirm: str
    verified: bool = False


class LoginMemberSchema(BaseModel):
    email: Optional[EmailStr] = None
    username: Optional[str] = None
    password: constr(min_length=8)


class AdminApprovalRequest(BaseModel):
    status: str


class MembersResponse(BaseModel):
    id: str
    name: str
    email: str
    role: str
    photo: Optional[List[FileMetadata]] = []
    phone: Optional[str] = None
    created_at: datetime
    partner_user_id: Optional[str] = None
    status: Optional[str] = None
    partner_user_id: Optional[str] = None
    organization_name: Optional[str] = None
    organization_type: Optional[str] = None
    description: Optional[str] = None
    role: str
    created_at: datetime or None = None
    updated_at: datetime or None = None
    secondary_contact: Optional[str] or None = None
    gender: Optional[str] or None = None
    date_of_birth: Optional[str] or None = None
    address: Optional[str] or None = None
    annual_income: Optional[int] = None
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
