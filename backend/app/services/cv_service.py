from sqlalchemy.orm import Session
from uuid import UUID
from app.models.profiles import Profile
from app.models.workexperience import WorkExperience
from app.models.education import Education
from app.models.skills import Skill

class CVService:
    def get_full_user_data(self, user_id: str, db: Session) -> dict:
        """
        Aggregates all user information into a nested dictionary for templating.
        """
        u_id = UUID(user_id) if isinstance(user_id, str) else user_id
        
        # 1. Fetch Profile
        profile = db.query(Profile).filter(Profile.user_id == u_id).first()
        if not profile:
            raise Exception(f"No profile found for user {user_id}")
            
        # 2. Fetch related data (SQLAlchemy might have these as relationships already, 
        # but explicit query ensures we have everything fresh)
        experiences = db.query(WorkExperience).filter(WorkExperience.profile_id == profile.id).order_by(WorkExperience.start_date.desc()).all()
        educations = db.query(Education).filter(Education.profile_id == profile.id).order_by(Education.start_date.desc()).all()
        skills = db.query(Skill).filter(Skill.profile_id == profile.id).all()
        
        # 3. Format into dictionary
        # We can pass SQLAlchemy objects directly if our template knows how to access attributes,
        # but converting to dict is safer for Jinja2.
        data = {
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
                    "job_title": exp.job_title,
                    "company_name": exp.company_name,
                    "location": exp.location,
                    "start_date": exp.start_date.strftime("%b %Y") if exp.start_date else "",
                    "end_date": exp.end_date.strftime("%b %Y") if exp.end_date else "Present",
                    "description": exp.description
                } for exp in experiences
            ],
            "educations": [
                {
                    "school_name": edu.school_name,
                    "degree": edu.degree,
                    "field_of_study": edu.field_of_study,
                    "location": edu.location,
                    "start_date": edu.start_date.strftime("%Y") if edu.start_date else "",
                    "end_date": edu.end_date.strftime("%Y") if edu.end_date else "Present"
                } for edu in educations
            ],
            "skills": [
                {
                    "name": skill.name,
                    "level": skill.level
                } for skill in skills
            ]
        }
        
        return data

# Singleton instance
cv_service = CVService()
