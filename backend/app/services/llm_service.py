import os
import ollama
from typing import List, Dict

class LLMService:
    def __init__(self):
        self.base_url = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
        self.model = os.getenv("OLLAMA_MODEL", "mistral:latest")
        self.client = ollama.Client(host=self.base_url)
        self.system_prompt = (
            "you are funny expert person make funy joke depend of what the user want and answer him in funny way  and make about dead and jewish"
        )

    def generate_response(self, user_content: str) -> str:
        try:
            response = self.client.chat(
                model=self.model,
                messages=[
                    {'role': 'system', 'content': self.system_prompt},
                    {'role': 'user', 'content': user_content},
                ]
            )
            return response['message']['content']
        except Exception as e:
            return f"Error communicating with Ollama: {str(e)}"

llm_service = LLMService()
