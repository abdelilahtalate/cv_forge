import uuid
from datetime import datetime
from app.core.database import Base

def generate_uuid():
    """Generates a string UUID for model IDs."""
    return str(uuid.uuid4())

def utcnow():
    """Returns the current UTC datetime."""
    return datetime.utcnow()
