import secrets
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.user import User
from app.shemas.user import UserCreate, UserOut

router = APIRouter(tags=["users"])

@router.post("/login", response_model=UserOut)
def login_user(user_in: UserCreate, db: Session = Depends(get_db)):
    # Simple login/register mechanism for now
    user = db.query(User).filter(User.display_name == user_in.display_name).first()
    
    # Automatically generate a session token
    generated_token = secrets.token_urlsafe(32)
    
    if not user:
        user = User(
            display_name=user_in.display_name,
            role=user_in.role or "user",
            session_token=generated_token
        )
        db.add(user)
    else:
        # Refresh the session token on login
        user.session_token = generated_token
        
    db.commit()
    db.refresh(user)
    return user
