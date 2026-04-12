from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from uuid import UUID


# ---- Base ----
class ConversationBase(BaseModel):
    title: Optional[str] = None
    status: Optional[str] = "active"
    current_step: Optional[str] = None


# ---- Create ----
class ConversationCreate(ConversationBase):
    user_id: UUID


# ---- Update ----
class ConversationUpdate(BaseModel):
    title: Optional[str] = None
    status: Optional[str] = None
    current_step: Optional[str] = None


# ---- Response ----
class ConversationOut(ConversationBase):
    id: UUID
    user_id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True