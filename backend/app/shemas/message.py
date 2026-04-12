from pydantic import BaseModel
from typing import Optional
from uuid import UUID
from datetime import datetime

class MessageBase(BaseModel):
    content: str
    role: Optional[str] = "user"
    extracted_section: Optional[str] = None
    pdf_url: Optional[str] = None

class MessageCreate(MessageBase):
    conversation_id: UUID
    user_id: UUID

class MessageOut(MessageBase):
    id: UUID
    conversation_id: UUID
    role: str
    content: str
    created_at: datetime
    extracted_section: Optional[str] = None
    pdf_url: Optional[str] = None

    class Config:
        from_attributes = True
