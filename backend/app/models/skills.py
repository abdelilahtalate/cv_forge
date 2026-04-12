from __future__ import annotations

from typing import Optional

from sqlalchemy import ForeignKey, SmallInteger, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base, generate_uuid


class Skill(Base):
    __tablename__ = "skills"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)

    profile_id: Mapped[str] = mapped_column(
        ForeignKey("profiles.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )


    name: Mapped[str] = mapped_column(String(128), nullable=False)

    category: Mapped[Optional[str]] = mapped_column(String(128), nullable=True)
    # e.g: "Backend", "Frontend", "AI", "DevOps"

    level: Mapped[Optional[str]] = mapped_column(String(32), nullable=True)
    # e.g: beginner | intermediate | advanced | expert

    display_order: Mapped[int] = mapped_column(SmallInteger, default=0, nullable=False)


    profile: Mapped["Profile"] = relationship(back_populates="skills")

    def __repr__(self) -> str:
        return f"<Skill {self.name} ({self.level})>"