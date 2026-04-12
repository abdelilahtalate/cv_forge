import os
from langchain_ollama import ChatOllama
from langchain_core.prompts import ChatPromptTemplate
from agents.orechestrator.prompet import ORCHESTRATOR_SYSTEM_PROMPT

class Orchestrator:
    def __init__(self, model: str = None):
        """
        Initialize the Orchestrator with a specific model.
        If no model is provided, it defaults to ORCHESTRATOR_MODEL or fallback OLLAMA_MODEL.
        """
        self.base_url = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
        self.model_name = model or os.getenv("ORCHESTRATOR_MODEL") or os.getenv("OLLAMA_MODEL", "mistral:latest")
        
        self.llm = ChatOllama(
            model=self.model_name,
            base_url=self.base_url,
            temperature=0  # Minimal creativity for classification
        )
        
    def classify(self, user_input: str) -> str:
        """
        Classifies user input as 'command' or 'info'.
        """
        try:
            prompt = ChatPromptTemplate.from_messages([
                ("system", ORCHESTRATOR_SYSTEM_PROMPT),
                ("user", "{input}")
            ])
            
            chain = prompt | self.llm
            response = chain.invoke({"input": user_input})
            
            # Clean and return the label
            label = response.content.strip().lower()
            
            for intent in ("both", "store", "retrieve", "other", "latex"):
                if intent in label:
                    print(f"Classified intent: {intent} ")
                    return intent

            return "other"
        except Exception as e:
            return f"error: {str(e)}"

# Example singleton instance with default config
orchestrator = Orchestrator()
