from pydantic import BaseModel
from typing import Optional
from uuid import UUID


# ---- Base ----
class SkillBase(BaseModel):
    name: str
    category: Optional[str] = None
    level: Optional[str] = None
    display_order: int = 0


# ---- Create ----
class SkillCreate(SkillBase):
    profile_id: UUID


# ---- Update ----
class SkillUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    level: Optional[str] = None
    display_order: Optional[int] = None


# ---- Response ----
class SkillOut(SkillBase):
    id: UUID
    profile_id: UUID

    class Config:
        from_attributes = True