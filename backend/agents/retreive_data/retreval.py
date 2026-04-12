import os
import uuid
import json
from sqlalchemy.orm import Session
from langchain_ollama import ChatOllama
from langchain_core.prompts import ChatPromptTemplate

from app.models.profiles import Profile
from app.models.user import User
from agents.retreive_data.prompet import RETRIEVAL_SYSTEM_PROMPT

class DataRetriever:
    def __init__(self, model: str = None):
        """
        Initialize the Retriever with a specific model.
        """
        self.base_url = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
        self.model_name = model or os.getenv("REASONING_MODEL") or os.getenv("OLLAMA_MODEL", "mistral:latest")
        
        self.llm = ChatOllama(
            model=self.model_name,
            base_url=self.base_url,
            temperature=0.3  # Some creativity for fluent text
        )

    def get_user_summary(self, user_id: str, db: Session, user_query: str = "") -> str:
        """
        Fetches user data and generates a fluent summary.
        """
        try:
            # 1. Fetch Profile and related data
            # Ensure user_id is a UUID object
            if isinstance(user_id, str):
                user_id_obj = uuid.UUID(user_id)
            else:
                user_id_obj = user_id

            profile = db.query(Profile).filter(Profile.user_id == user_id_obj).first()
            
            if not profile:
                return "I don't have any professional information stored for you yet. Would you like to tell me about your background?"

            # 2. Serialize data for the LLM
            user_data = {
                "profile": {
                    "full_name": profile.full_name,
                    "email": profile.email,
                    "phone": profile.phone,
                    "location": profile.location,
                    "website": profile.website,
                    "linkedin_url": profile.linkedin_url,
                    "github_url": profile.github_url,
                    "summary": profile.summary
                },
                "work_experiences": [
                    {
                        "company": w.company,
                        "position": w.position,
                        "location": w.location,
                        "start_date": str(w.start_date) if w.start_date else None,
                        "end_date": str(w.end_date) if w.end_date else None,
                        "description": w.description
                    } for w in profile.work_experiences
                ],
                "educations": [
                    {
                        "institution": e.institution,
                        "degree": e.degree,
                        "field_of_study": e.field_of_study,
                        "start_date": str(e.start_date) if e.start_date else None,
                        "end_date": str(e.end_date) if e.end_date else None,
                        "grade": e.grade
                    } for e in profile.educations
                ],
                "skills": [
                    {"name": s.name, "category": s.category, "level": s.level}
                    for s in profile.skills
                ]
            }

            # 3. Call the LLM
            # 3. Call the LLM
            prompt = ChatPromptTemplate.from_messages([
                ("system", RETRIEVAL_SYSTEM_PROMPT),
                ("user", "### Data Provided (JSON):\n{user_data}\n\n### User's Specific Request:\n{user_query}")
            ])
            
            chain = prompt | self.llm
            response = chain.invoke({
                "user_data": json.dumps(user_data, indent=2),
                "user_query": user_query or "Please summarize my profile and suggest any improvements."
            })
            
            return response.content
            
        except Exception as e:
            return f"I encountered an error while trying to retrieve your profile: {str(e)}"

# Singleton instance
data_retriever = DataRetriever()
