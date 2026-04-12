from __future__ import annotations

from datetime import date
from typing import Optional

from sqlalchemy import Boolean, ForeignKey, SmallInteger, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base, generate_uuid, utcnow


class WorkExperience(Base):
    __tablename__ = "work_experiences"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)

    profile_id: Mapped[str] = mapped_column(
        ForeignKey("profiles.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )

    company: Mapped[str] = mapped_column(String(255), nullable=False)

    position: Mapped[str] = mapped_column(String(255), nullable=False)

    location: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)

    # ✅ FIXED: use date instead of string
    start_date: Mapped[Optional[date]] = mapped_column(nullable=True)

    end_date: Mapped[Optional[date]] = mapped_column(nullable=True)

    is_current: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    display_order: Mapped[int] = mapped_column(SmallInteger, default=0, nullable=False)

    profile: Mapped["Profile"] = relationship(back_populates="work_experiences")

    def __repr__(self) -> str:
        return f"<WorkExperience {self.position} @ {self.company}>"