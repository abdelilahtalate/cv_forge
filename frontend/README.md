# CV Forge — React + TypeScript + Vite

AI-powered resume builder. Local-first, zero-backend required for the UI layer.

## Quick Start

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Stack

| Layer | Tech |
|-------|------|
| Framework | React 18 + TypeScript |
| Build | Vite 5 |
| Styling | Tailwind CSS v3 |
| State | Zustand |
| Icons | Font Awesome 6 |
| Fonts | Space Grotesk + DM Sans |

## Project Structure

```
src/
├── App.tsx               # Root layout + routing
├── main.tsx              # Entry point
├── index.css             # Global styles + Tailwind
│
├── chat/                 # Chat UI primitives
│   ├── MessageList.tsx
│   ├── MessageBubble.tsx
│   ├── InputBar.tsx
│   ├── TypingIndicator.tsx
│   └── CodeBlock.tsx
│
├── cv-preview/           # Resume rendering
│   ├── CVPreview.tsx
│   ├── PDFRenderer.tsx
│   └── TemplateThumb.tsx
│
├── components/
│   ├── sidebar/Sidebar.tsx
│   └── Toggle.tsx
│
├── pages/                # Full-page views
│   ├── ChatPage.tsx
│   ├── TemplatesPage.tsx
│   ├── SettingsPage.tsx
│   └── HistoryPage.tsx   # Profile Memory
│
├── store/                # Zustand stores
│   ├── chatStore.ts
│   ├── memoryStore.ts
│   ├── cvStore.ts
│   └── settingsStore.ts
│
├── services/             # Data + API layer
│   ├── api.ts            # Mock data + AI response engine
│   ├── cv.service.ts
│   ├── memory.service.ts
│   └── websocket.ts
│
├── hooks/                # Custom hooks
│   ├── useChat.ts
│   ├── useMemory.ts
│   ├── useCV.ts
│   └── useWebSocket.ts
│
├── types/                # TypeScript interfaces
│   ├── message.ts
│   ├── memory.ts
│   ├── cv.ts
│   └── agent.ts
│
└── utils/
    └── format.tsx        # Text formatting helpers
```

## Connecting a Real Backend

1. Replace `getAIResponse()` in `src/services/api.ts` with a real fetch call
2. Use `src/services/websocket.ts` for streaming responses
3. Implement `src/services/memory.service.ts` to persist profiles server-side

## Key Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + B` | Toggle sidebar |
| `Escape` | Close CV preview / mobile menu |
| `Enter` | Send chat message |
| `Shift + Enter` | New line in chat input |
