from fastapi import APIRouter, Depends, HTTPException, Response
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from typing import List
import uuid
import os
from pathlib import Path

from app.core.database import get_db
from app.shemas.message import MessageCreate, MessageOut
from app.models.message import Message
from app.models.conversation import Conversation
from app.models.user import User
from app.services.llm_service import llm_service
from agents.graph import compiled_graph

router = APIRouter(tags=["chat"])

# Base directory for exports
# backend/app/api/v1/routers/chat.py -> needs 5 parents to reach backend/
EXPORTS_DIR = Path(__file__).parent.parent.parent.parent.parent / "exports"

@router.post("/", response_model=List[MessageOut])
def send_message(message_in: MessageCreate, db: Session = Depends(get_db)):
    # ... (rest of the existing send_message logic)
    # 1. Fetch existing conversation
    conversation = db.query(Conversation).filter(Conversation.id == message_in.conversation_id).first()
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
        
    # Verify the conversation belongs to the user
    if str(conversation.user_id) != str(message_in.user_id):
        raise HTTPException(status_code=403, detail="Conversation does not belong to this user")

    # 2. Add user message
    user_msg = Message(
        conversation_id=conversation.id,
        role=message_in.role or "user",
        content=message_in.content,
        extracted_section=message_in.extracted_section
    )
    db.add(user_msg)
    db.commit()

    # 3. Invoke the Agent Graph
    state = {
        "user_id": str(conversation.user_id),
        "conversation_id": str(conversation.id),
        "user_input": message_in.content,
        "db": db,
        "intent": "",
        "response": "",
        "intermediate_data": {}
    }
    
    result = compiled_graph.invoke(state)
    
    # 4. Sync and return
    db.refresh(user_msg)
    
    # The assistant message is already created and committed by the responder_node in graph.py
    assistant_msg = db.query(Message).filter(
        Message.conversation_id == conversation.id,
        Message.role == "assistant"
    ).order_by(Message.created_at.desc()).first()

    return [user_msg, assistant_msg]

@router.get("/conversation/{conversation_id}", response_model=List[MessageOut])
def get_messages(conversation_id: uuid.UUID, db: Session = Depends(get_db)):
    return db.query(Message).filter(Message.conversation_id == conversation_id).order_by(Message.created_at.asc()).all()

@router.get("/view/{filename}")
def view_cv(filename: str):
    file_path = EXPORTS_DIR / filename
    if not file_path.exists():
        if not filename.endswith(".pdf"):
            file_path = EXPORTS_DIR / f"{filename}.pdf"

    if not file_path.exists():
        raise HTTPException(status_code=404, detail="CV file not found")

    # Read and return with explicit headers — no filename= to avoid download trigger
    return Response(
        content=file_path.read_bytes(),
        media_type="application/pdf",
        headers={
            "Content-Disposition": "inline",          # no filename= here
            "X-Content-Type-Options": "nosniff",
            "Cache-Control": "no-store",
        }
    )

import base64

@router.get("/view-base64/{filename}")
def view_cv_base64(filename: str):
    file_path = EXPORTS_DIR / filename
    if not file_path.exists():
        if not filename.endswith(".pdf"):
            file_path = EXPORTS_DIR / f"{filename}.pdf"

    if not file_path.exists():
        raise HTTPException(status_code=404, detail="CV file not found")

    file_data = file_path.read_bytes()
    base64_encoded = base64.b64encode(file_data).decode('utf-8')
    
    return {"data": f"data:application/pdf;base64,{base64_encoded}"}

@router.get("/download/{filename}")
def download_cv(filename: str):
    file_path = EXPORTS_DIR / filename
    if not file_path.exists():
        if not filename.endswith(".pdf"):
            file_path = EXPORTS_DIR / f"{filename}.pdf"
            
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="CV file not found")
        
    return FileResponse(
        path=file_path, 
        filename=file_path.name,
        media_type='application/pdf'
    )
@router.get("/test-pdf/{filename}")
def test_pdf(filename: str):
    file_path = EXPORTS_DIR / filename
    return {
        "exists": file_path.exists(),
        "path": str(file_path),
        "size": file_path.stat().st_size if file_path.exists() else None
    }