import uuid
from datetime import datetime

from sqlalchemy import Column, String, DateTime, ForeignKey, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.core.database import Base


class CVVersion(Base):
    __tablename__ = "cv_versions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)

    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)

    profile_id = Column(UUID(as_uuid=True), ForeignKey("profiles.id"), nullable=False, index=True)

    template_id = Column(UUID(as_uuid=True), ForeignKey("cv_templates.id"), nullable=False)

    conversation_id = Column(UUID(as_uuid=True), ForeignKey("conversations.id"), nullable=True)

    title = Column(String, nullable=True)

    status = Column(String, default="generated")  # generated | draft | failed | archived

    file_path = Column(String, nullable=True)

    file_format = Column(String, default="pdf")  # pdf | docx | html

    customization_json = Column(JSON, nullable=True)

    generated_at = Column(DateTime, default=datetime.utcnow)

    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # relationships (optional but useful)
    user = relationship("User", backref="cv_versions")
    profile = relationship("Profile", backref="cv_versions")
    template = relationship("CVTemplate")
    conversation = relationship("Conversation", backref="cv_versions")