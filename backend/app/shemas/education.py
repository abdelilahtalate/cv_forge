from pydantic import BaseModel
from datetime import date
from typing import Optional
from uuid import UUID


# ---- Base ----
class EducationBase(BaseModel):
    institution: str
    degree: Optional[str] = None
    field_of_study: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    grade: Optional[str] = None
    description: Optional[str] = None
    display_order: int = 0


# ---- Create ----
class EducationCreate(EducationBase):
    profile_id: UUID


# ---- Update ----
class EducationUpdate(BaseModel):
    institution: Optional[str] = None
    degree: Optional[str] = None
    field_of_study: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    grade: Optional[str] = None
    description: Optional[str] = None
    display_order: Optional[int] = None


# ---- Response ----
class EducationOut(EducationBase):
    id: UUID
    profile_id: UUID

    class Config:
        from_attributes = True