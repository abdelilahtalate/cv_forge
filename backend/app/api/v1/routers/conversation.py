from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models.conversation import Conversation
from app.models.user import User
from app.shemas.conversations import ConversationCreate, ConversationOut
from uuid import UUID

router = APIRouter(tags=["conversations"])

@router.post("/", response_model=ConversationOut)
def create_conversation(conv_in: ConversationCreate, db: Session = Depends(get_db)):
    # Verify user exists
    user = db.query(User).filter(User.id == conv_in.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    conversation = Conversation(
        user_id=conv_in.user_id,
        title=conv_in.title or "New Conversation",
        status=conv_in.status or "active",
        current_step=conv_in.current_step
    )
    db.add(conversation)
    db.commit()
    db.refresh(conversation)
    return conversation

@router.get("/user/{user_id}", response_model=List[ConversationOut])
def get_user_conversations(user_id: str, db: Session = Depends(get_db)):
    u_id = UUID(user_id) if isinstance(user_id, str) else user_id
    return db.query(Conversation).filter(Conversation.user_id == u_id).order_by(Conversation.created_at.desc()).all()
