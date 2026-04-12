# 🌉 Connecting Chat Frontend & Backend: Educational Guide

This guide explains the architecture and data flow between the React frontend and the FastAPI backend in the **CV Forge** project.

## 1. Authentication & Session Flow
The system uses a "Login-first" approach to ensure every conversation is linked to a user.

### Sequence:
1.  **Frontend**: The `LoginPage` captures the user's `display_name`.
2.  **API**: `chatApi.login()` calls `POST /api/v1/users/login`.
3.  **Backend**: The `user_router` finds or creates the user and generates a `session_token`.
4.  **State**: The frontend saves the returned `User` object in `chatStore` (persisted in `localStorage` via Zustand).

## 2. Multi-Session Orchestration
Instead of a single global chat, the project supports multiple independent conversations.

### Data Model:
- **Conversation**: Belongs to a **User**. Has many **Messages**.
- **Message**: Linked to a **Conversation**. Has a `role` (user or assistant).

### Flow:
- When you click **"New Chat"**, the frontend calls `POST /api/v1/conversations/`.
- The backend creates a new entry in the `conversations` table and returns a unique UUID (`id`).
- The frontend sets this `id` as the `activeConversationId`. All subsequent messages are tagged with this ID.

## 3. The Message Pipeline (The LangGraph Bridge)
This is where the "intelligence" happens. When you send a message:

### Step 1: Frontend Request
The `useChat` hook calls `chatApi.sendMessage` with:
- `user_id`: To verify ownership.
- `conversation_id`: To know which history to update.
- `content`: Your actual message.

### Step 2: Backend Orchestration
The backend `chat_router` receives the request and:
1.  Saves your message to the database immediately.
2.  Prepares a **State Object** for the **LangGraph**.
3.  Invokes `compiled_graph.invoke(state)`.

### Step 3: LangGraph Processing
The graph executes its nodes:
- **Orchestrator Node**: Classifies your intent (Are you storing info? Asking to see your profile?).
- **Extractor Node**: (Optional) If you're providing info, it parses it into JSON and updates your `profiles` table.
- **Retriever Node**: (Optional) If you're asking about your data, it fetches from the database and generates a summary.
- **Responder Node**: Generates the final text response and **saves it to the database** as an 'assistant' message.

### Step 4: Frontend Update
The API call returns the message history (or the new pair). The frontend updates the `chatStore`, and the new messages appear in your `MessageList`.

## 🗝️ Key Technologies
- **JSON Mode**: We use Ollama's JSON mode in the Extractor agent for reliable structured data.
- **Zustand Persist**: Ensures that if you refresh the page or close your browser, you stay logged in and your active chat remains open.
- **UUIDs**: Used for all IDs (`user_id`, `conversation_id`) to ensure global uniqueness and security.

---
*Created by Antigravity for the CV Forge Project.*
