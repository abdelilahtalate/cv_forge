from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from uuid import UUID


class UserBase(BaseModel):
    display_name: str
    role: str = "user"


class UserCreate(UserBase):
    session_token: Optional[str] = None


class UserUpdate(BaseModel):
    display_name: Optional[str] = None
    role: Optional[str] = None
    session_token: Optional[str] = None


class UserOut(UserBase):
    id: UUID
    session_token: Optional[str]
    created_at: datetime
    last_active_at: datetime
    converted_at: Optional[datetime]

    class Config:
        from_attributes = True