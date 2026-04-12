# CV Agent Project Knowledge Base & Rules

## 1. Project Overview
The `cv-agent` project is an AI-powered Resume (CV) Builder application split into two main architectures:
- **Frontend (cv-forge):** A modern React application built using Vite, TypeScript, Tailwind CSS, and Zustand. 
- **Backend:** A Python application built with FastAPI, designed to power a multi-agent architectural backend.

**Current State:** The frontend operates with placeholder/mocked data and simulated AI latency (via `src/services/api.ts`). The backend is currently a skeleton with an empty agentic logic core but exposes a basic echo `/chat` endpoint. 

The end-goal is to convert this mock-driven frontend into a fully dynamic site powered by the sophisticated backend agents.

---

## 2. Frontend Architecture (Current & Future Rules)

### Current Architecture:
- State is managed via **Zustand** stores (`chatStore.ts`, `cvStore.ts`, `memoryStore.ts`, `settingsStore.ts`).
- Interactions with the "AI" are resolved in `src/hooks/useChat.ts`, where a fake `setTimeout` delay is invoked and hardcoded mock responses are fetched from `src/services/api.ts` using predefined regex triggers.
- The UI handles states like `showPreview`, `addCV`, and `isTyping`.

### Future Dynamic Rules:
1. **API Integration:** The mock logic in `src/services/api.ts` must be completely replaced with actual HTTP calls (or WebSockets) to the backend API (`http://localhost:8000/chat`).
2. **State Syncing:** When `sendMessage` is fired, `chatStore.ts` must set `isTyping = true` and keep it true until the real HTTP response resolves. 
3. **Structured Responses:** The frontend currently expects specific metadata from the AI (e.g., `showPreview: boolean`, `addCV: object`). The FastAPI backend responses must be structured to match this JSON formatting so the Zustand store can correctly open the preview panel or add a generated CV to the list.
4. **Dynamic Data Loading:** Hardcoded `MOCK_PROFILE`, `MOCK_GENERATED_CVS`, and `MOCK_TEMPLATES` must be fetched from backend endpoints (e.g., `GET /api/profile`, `GET /api/cvs`) during the initial application load.

---

## 3. Backend Architecture (Current & Future Rules)

### Current Architecture:
- Exposes basic endpoints: `GET /` and `POST /chat` in `api/routes/chat.py`. Structure includes `ChatRequest` and `ChatResponse` classes.
- A robust directory skeleton exists reflecting a **Multi-Agent RAG System**:
    - `/agents`: `cv_agent.py`, `memory_agent.py`, `research_agent.py`, `tool_agent.py`
    - `/core`: `orchestrator.py`, `intent_classifier.py`
    - `/llm`: `base.py`, `ollama.py`, `openai.py`
    - `/rag`: `embedder.py`, `retriever.py`, `vector_db.py`, `job_scraper.py`

### Future Dynamic Rules:
1. **Endpoint Expansion:** Expand the `/chat` route. Instead of returning `f"You said: {message}"`, the route should instantiate the **Orchestrator** (`core/orchestrator.py`).
2. **The Orchestrator Flow:** 
    - Incoming messages must be evaluated by the `intent_classifier.py`.
    - If the user wants to update their profile -> delegate to `memory_agent.py`.
    - If the user wants to fetch job requirements -> delegate to `research_agent.py` and `job_scraper.py`.
    - If the user wants to generate/edit a CV -> delegate to `cv_agent.py`.
3. **LLM & RAG Integration:** 
    - Define interfaces in `llm/base.py` to allow easy switching between `openai` and `ollama` providers. 
    - Implement RAG logic so `cv_agent.py` can fetch the user's latest "profile memory" from `vector_db`.
4. **JSON Schema Adherence:** Ensure that when the LLM generates a response, it can be parsed into the strict JSON object expected by the React frontend: 
   ```json
   {
      "response": "Here is your tailored resume...",
      "showPreview": true,
      "addCV": { "target": "Job Title", "template": "Minimal" }
   }
   ```

---

## 4. Work Flow for Future Implementation

Whenever you (the AI) are tasked to build out features for this dynamic site, follow these steps:
1. **Check this doc:** Treat `PROJECT_KNOWLEDGE.md` as the unified truth.
2. **Update the schema:** If adding a new feature, make sure the Pydantic models in the backend correspond to the TypeScript interfaces in `frontend/src/types`.
3. **Remove mocks incrementally:** When integrating the `/chat` API, conditionally remove the static strings from `api.ts` to avoid breaking the UI while work is on-going.
4. **Focus on single agent flows:** When implementing backend agents, ensure the `orchestrator.py` can handle one capability (e.g., Chatting) perfectly before layering on complex RAG or Memory saving.
