from datetime import date, datetime, time, timedelta
from typing import List, Optional
from pydantic import BaseModel, EmailStr, constr


class FileMetadata(BaseModel):
    file_id: str
    file_name: str


class UserBaseSchema(BaseModel):
    name: str
    email: str
    photo: Optional[List[FileMetadata]] = []
    organization_name: Optional[str] = None
    organization_type: Optional[str] = None
    description: Optional[str] = None
    role: str
    created_at: datetime or None = None
    updated_at: datetime or None = None


class CreateUserSchema(UserBaseSchema):
    password: constr(min_length=8)
    passwordConfirm: str
    verified: bool = False


class LoginUserSchema(BaseModel):
    email: EmailStr
    password: constr(min_length=8)


class PasswordResetRequest(BaseModel):
    email: EmailStr


class UserResponse(BaseModel):
    name: str
    email: str
    organization_name: Optional[str] = None
    organization_type: Optional[str] = None
    description: Optional[str] = None
    role: str
    members_count: int
    created_at: datetime
    photo: Optional[List[FileMetadata]] = []


class LoginActivitySchema(BaseModel):
    email: str
    user_id: str
    role: str
    created_at: datetime
