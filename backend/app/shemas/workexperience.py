from pydantic import BaseModel
from datetime import date
from typing import Optional
from uuid import UUID


# ---- Base ----
class WorkExperienceBase(BaseModel):
    company: str
    position: str
    location: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    is_current: bool = False
    description: Optional[str] = None
    display_order: int = 0


# ---- Create ----
class WorkExperienceCreate(WorkExperienceBase):
    profile_id: UUID
    source_message_id: Optional[UUID] = None


# ---- Update ----
class WorkExperienceUpdate(BaseModel):
    company: Optional[str] = None
    position: Optional[str] = None
    location: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    is_current: Optional[bool] = None
    description: Optional[str] = None
    display_order: Optional[int] = None


# ---- Response ----
class WorkExperienceOut(WorkExperienceBase):
    id: UUID
    profile_id: UUID
    source_message_id: Optional[UUID]

    class Config:
        from_attributes = True