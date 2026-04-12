import os
import json
from langchain_ollama import ChatOllama
from langchain_core.prompts import ChatPromptTemplate
from agents.extractInfo.prompet import EXTRACTOR_SYSTEM_PROMPT

class InformationExtractor:
    def __init__(self, model: str = None):
        """
        Initialize the Extractor with a specific model.
        Targeting a larger model for better extraction reliability.
        """
        self.base_url = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
        # Default to REASONING_MODEL if available, else OLLAMA_MODEL
        self.model_name = model or os.getenv("REASONING_MODEL") or os.getenv("OLLAMA_MODEL", "mistral:latest")
        
        self.llm = ChatOllama(
            model=self.model_name,
            base_url=self.base_url,
            temperature=0,  # Strict extraction
            format="json"   # Request JSON mode from Ollama if supported
        )

    def extract(self, user_input: str) -> dict:
        """
        Parses user input into structured CV data.
        """
        
        try:
            
            prompt = ChatPromptTemplate.from_messages([
                ("system", EXTRACTOR_SYSTEM_PROMPT),
                ("user", "{input}")
            ])
            chain = prompt | self.llm
            response = chain.invoke({"input": user_input})
            # Parse the JSON response
            content = response.content.strip()
            
            # Handle potential markdown code blocks if the model includes them despite instructions
            if content.startswith("```json"):
                content = content.replace("```json", "").replace("```", "").strip()
            elif content.startswith("```"):
                content = content.replace("```", "").strip()
                
            data = json.loads(content)
            return data
            
        except json.JSONDecodeError as je:
            return {"error": f"Failed to parse JSON: {str(je)}", "raw": response.content}
        except Exception as e:
            return {"error": str(e)}

# Singleton instance
extractor = InformationExtractor()
