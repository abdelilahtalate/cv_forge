from pydantic import BaseModel
from datetime import datetime
from typing import Optional, Dict, Any
from uuid import UUID


# ---- Base ----
class CVVersionBase(BaseModel):
    title: Optional[str] = None
    status: str = "generated"
    file_path: Optional[str] = None
    file_format: str = "pdf"
    customization_json: Optional[Dict[str, Any]] = None


# ---- Create ----
class CVVersionCreate(CVVersionBase):
    user_id: UUID
    profile_id: UUID
    template_id: UUID
    conversation_id: Optional[UUID] = None


# ---- Update ----
class CVVersionUpdate(BaseModel):
    title: Optional[str] = None
    status: Optional[str] = None
    file_path: Optional[str] = None
    file_format: Optional[str] = None
    customization_json: Optional[Dict[str, Any]] = None


# ---- Response ----
class CVVersionOut(CVVersionBase):
    id: UUID
    user_id: UUID
    profile_id: UUID
    template_id: UUID
    conversation_id: Optional[UUID]
    generated_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True