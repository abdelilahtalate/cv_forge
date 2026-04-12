import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

# Load environment variables from .env file
load_dotenv()

from app.core.database import engine, Base
from app.api.v1.routers import chat, user, conversation

# Ensure exports directory exists
os.makedirs("exports", exist_ok=True)

app = FastAPI(title="CV Agent API")

app.mount("/api/v1/outputs", StaticFiles(directory="exports"), name="outputs")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # your React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["Content-Disposition"],   # important for the browser
)

@app.on_event("startup")
def on_startup():
    # Automatically create tables in SQLite
    Base.metadata.create_all(bind=engine)

app.include_router(user.router, prefix="/api/v1/users")
app.include_router(conversation.router, prefix="/api/v1/conversations")
app.include_router(chat.router, prefix="/api/v1/chat")

