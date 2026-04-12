# Database Models and Schemas UML Diagram

Based on the entities defined in `backend/app/models` and their corresponding DTOs in `backend/app/schemas`, here is a comprehensive Entity-Relationship Class Diagram mapping out the application's core domain.

## Key Relationships
- **User** is the core entity that owns **Profiles**, **Conversations**, and **CVVersions**.
- **Profiles** contain detailed elements like **Educations**, **WorkExperiences**, and **Skills**.
- **Conversations** and **Messages** handle the LLM integration flow and interaction history.

```mermaid
classDiagram
    class User {
        UUID id
        String session_token
        String display_name
        Enum role
        DateTime created_at
        DateTime last_active_at
        DateTime converted_at
    }

    class Profile {
        UUID id
        UUID user_id
        String full_name
        String email
        String phone
        String location
        String website
        String linkedin_url
        String github_url
        String summary
        DateTime created_at
        DateTime updated_at
    }

    class WorkExperience {
        String id
        String profile_id
        String company
        String position
        String location
        Date start_date
        Date end_date
        Boolean is_current
        Text description
        int display_order
    }

    class Education {
        String id
        String profile_id
        String institution
        String degree
        String field_of_study
        Date start_date
        Date end_date
        String grade
        Text description
        int display_order
    }

    class Skill {
        String id
        String profile_id
        String name
        String category
        String level
        int display_order
        String source_message_id
    }

    class Conversation {
        UUID id
        UUID user_id
        String title
        Enum status
        String current_step
        DateTime created_at
        DateTime updated_at
    }

    class Message {
        UUID id
        UUID conversation_id
        String role
        Text content
        String extracted_section
        DateTime created_at
    }

    class CVTemplate {
        UUID id
        String name
        String description
        String thumbnail_url
        JSON layout_config
        Boolean is_active
        DateTime created_at
    }

    class CVVersion {
        UUID id
        UUID user_id
        UUID profile_id
        UUID template_id
        UUID conversation_id
        String title
        String status
        String file_path
        String file_format
        JSON customization_json
        DateTime generated_at
        DateTime updated_at
    }

    User "1" --> "*" Profile : has
    User "1" --> "*" Conversation : starts
    User "1" --> "*" CVVersion : owns
    
    Profile "1" --> "*" WorkExperience : includes
    Profile "1" --> "*" Education : includes
    Profile "1" --> "*" Skill : includes
    Profile "1" --> "*" CVVersion : used in
    
    Conversation "1" --> "*" Message : contains
    Conversation "1" --> "*" CVVersion : generates
    
    CVTemplate "1" --> "*" CVVersion : forms
    
    Message "1" --> "0..1" Skill : source of
```

> [!NOTE] 
> The `backend/app/shemas` directory reflects these underlying models via modular Base, Create, Update, and Output Pydantic schemas which validate data flowing into and out of these core tables.

> [!TIP]
> A small observation: the `cv_templates` file in `models` is missing its `.py` file extension, and some files in the `shemas` directory have commas instead of dots in their names (e.g. `user,py`). You might want to rename them for proper python resolution!
