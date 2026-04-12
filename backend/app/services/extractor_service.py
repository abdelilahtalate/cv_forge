import uuid
from sqlalchemy.orm import Session
from datetime import datetime
from typing import Dict, Any, Union
import logging

from app.models.user import User
from app.models.profiles import Profile
from app.models.workexperience import WorkExperience
from app.models.education import Education
from app.models.skills import Skill
from agents.extractInfo.extracteInfo import extractor

logger = logging.getLogger(__name__)

class ExtractorService:
    @staticmethod
    def sync_user_profile(user_id: Union[str, uuid.UUID], user_input: str, db: Session) -> Dict[str, Any]:
        """
        Extracts information from user input and synchronizes it with the database.
        """
        # Ensure user_id is a UUID object for SQLAlchemy
        if isinstance(user_id, str):
            try:
                user_id_obj = uuid.UUID(user_id)
            except ValueError:
                return {"error": f"Invalid user_id format: {user_id}"}
        else:
            user_id_obj = user_id

        # 1. Extract data using the agent
        extracted_data = extractor.extract(user_input)
        print(extracted_data)
        if "error" in extracted_data:
            logger.error(f"Extraction error: {extracted_data['error']}")
            return extracted_data

        try:
            # 2. Get or create Profile for the user
            profile = db.query(Profile).filter(Profile.user_id == user_id_obj).first()
            
            profile_json = extracted_data.get("profile", {})
            
            if not profile:
                # Create initial profile
                full_name = profile_json.get("full_name") or "New Profile"
                profile = Profile(user_id=user_id_obj, full_name=full_name)
                db.add(profile)
                db.flush()  # Get profile.id without committing
            
            # 3. Update Profile fields if found in extraction
            if profile_json:
                for key, value in profile_json.items():
                    if value is not None and hasattr(profile, key):
                        setattr(profile, key, value)

            # Helper to parse dates
            def parse_date(date_str):
                if not date_str:
                    return None
                try:
                    return datetime.strptime(date_str, "%Y-%m-%d").date()
                except ValueError:
                    return None

            # 4. Add Work Experiences
            for work in extracted_data.get("work_experiences", []):
                new_work = WorkExperience(
                    profile_id=profile.id,
                    company=work.get("company", "Unknown Company"),
                    position=work.get("position", "Unknown Position"),
                    location=work.get("location"),
                    start_date=parse_date(work.get("start_date")),
                    end_date=parse_date(work.get("end_date")),
                    is_current=work.get("is_current", False),
                    description=work.get("description")
                )
                db.add(new_work)

            # 5. Add Educations
            for edu in extracted_data.get("educations", []):
                new_edu = Education(
                    profile_id=profile.id,
                    institution=edu.get("institution", "Unknown Institution"),
                    degree=edu.get("degree"),
                    field_of_study=edu.get("field_of_study"),
                    start_date=parse_date(edu.get("start_date")),
                    end_date=parse_date(edu.get("end_date")),
                    grade=edu.get("grade"),
                    description=edu.get("description")
                )
                db.add(new_edu)

            # 6. Add Skills
            for skill in extracted_data.get("skills", []):
                new_skill = Skill(
                    profile_id=profile.id,
                    name=skill.get("name", "Unknown Skill"),
                    category=skill.get("category"),
                    level=skill.get("level")
                )
                db.add(new_skill)

            db.commit()
            return extracted_data

        except Exception as e:
            db.rollback()
            logger.error(f"Database sync error: {str(e)}")
            return {"error": f"Database sync failed: {str(e)}"}

extractor_service = ExtractorService()
