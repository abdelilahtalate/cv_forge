from pydantic import BaseModel
from datetime import datetime
from typing import Optional, Dict, Any
from uuid import UUID


# ---- Base ----
class CVTemplateBase(BaseModel):
    name: str
    description: Optional[str] = None
    thumbnail_url: Optional[str] = None
    layout_config: Dict[str, Any]
    is_active: bool = True


# ---- Create ----
class CVTemplateCreate(CVTemplateBase):
    pass


# ---- Update ----
class CVTemplateUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    thumbnail_url: Optional[str] = None
    layout_config: Optional[Dict[str, Any]] = None
    is_active: Optional[bool] = None


# ---- Response ----
class CVTemplateOut(CVTemplateBase):
    id: UUID
    created_at: datetime

    class Config:
        from_attributes = True