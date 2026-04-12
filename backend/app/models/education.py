from __future__ import annotations

from datetime import date
from typing import Optional

from sqlalchemy import ForeignKey, SmallInteger, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base, generate_uuid


class Education(Base):
    __tablename__ = "educations"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)

    profile_id: Mapped[str] = mapped_column(
        ForeignKey("profiles.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )

    institution: Mapped[str] = mapped_column(String(255), nullable=False)

    degree: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)

    field_of_study: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)

    # ✅ use real date types (important for CV logic)
    start_date: Mapped[Optional[date]] = mapped_column(nullable=True)

    end_date: Mapped[Optional[date]] = mapped_column(nullable=True)

    grade: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)

    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    display_order: Mapped[int] = mapped_column(SmallInteger, default=0, nullable=False)

    profile: Mapped["Profile"] = relationship(back_populates="educations")

    def __repr__(self) -> str:
        return f"<Education {self.degree} @ {self.institution}>"