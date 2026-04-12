# ================================
# Backend Project Setup Script
# ================================

Write-Host "🚀 Setting up backend project..."

# Root folder
$root = "backend"

# Create root
New-Item -ItemType Directory -Force -Path $root | Out-Null

# Helper function to create files
function Create-File($path) {
    New-Item -ItemType File -Force -Path $path | Out-Null
}

# Helper function to create directories
function Create-Dir($path) {
    New-Item -ItemType Directory -Force -Path $path | Out-Null
}

# -------------------------------
# Base files
# -------------------------------
Create-File "$root/.env"
Create-File "$root/.env.example"
Create-File "$root/main.py"
Create-File "$root/requirements.txt"

# -------------------------------
# app/
# -------------------------------
Create-Dir "$root/app/core"
Create-Dir "$root/app/memory"
Create-Dir "$root/app/api"
Create-Dir "$root/app/models"
Create-Dir "$root/app/schemas"
Create-Dir "$root/app/services"

Create-File "$root/app/__init__.py"

# core
"config database redis llm storage middleware".Split(" ") | ForEach-Object {
    Create-File "$root/app/core/$_.py"
}
Create-File "$root/app/core/__init__.py"

# memory
"store summarizer extractor schemas".Split(" ") | ForEach-Object {
    Create-File "$root/app/memory/$_.py"
}
Create-File "$root/app/memory/__init__.py"

# api
"router chat cv profile memory".Split(" ") | ForEach-Object {
    Create-File "$root/app/api/$_.py"
}
Create-File "$root/app/api/__init__.py"

# models
"profile memory cv message template research agent_run application settings export feedback".Split(" ") | ForEach-Object {
    Create-File "$root/app/models/$_.py"
}
Create-File "$root/app/models/__init__.py"

# schemas
"profile cv chat memory".Split(" ") | ForEach-Object {
    Create-File "$root/app/schemas/$_.py"
}
Create-File "$root/app/schemas/__init__.py"

# services
"profile_service cv_service memory_service".Split(" ") | ForEach-Object {
    Create-File "$root/app/services/$_.py"
}
Create-File "$root/app/services/__init__.py"

# -------------------------------
# agents/
# -------------------------------
Create-Dir "$root/agents"
Create-File "$root/agents/__init__.py"
"state graph registry base".Split(" ") | ForEach-Object {
    Create-File "$root/agents/$_.py"
}

# Sub-agents
$agents = @(
    "supervisor",
    "orchestrator",
    "memory_agent",
    "info_collector",
    "clarification",
    "rag_research",
    "cv_writer",
    "latex_compiler",
    "template_agent",
    "preview_agent"
)

foreach ($agent in $agents) {
    Create-Dir "$root/agents/$agent"
    Create-File "$root/agents/$agent/__init__.py"
    Create-File "$root/agents/$agent/agent.py"
    Create-File "$root/agents/$agent/prompts.py"
}

# Special files
Create-File "$root/agents/info_collector/frames.py"
Create-File "$root/agents/rag_research/jd_scraper.py"
Create-File "$root/agents/rag_research/jd_parser.py"
Create-File "$root/agents/rag_research/gap_analyzer.py"

Create-File "$root/agents/latex_compiler/compiler.py"
Create-File "$root/agents/latex_compiler/template_filler.py"
Create-File "$root/agents/latex_compiler/escape.py"

Create-File "$root/agents/preview_agent/renderer.py"

# tools
Create-Dir "$root/agents/tools"
Create-File "$root/agents/tools/__init__.py"
"web_search_tool playwright_tool tectonic_tool pdf2image_tool vector_store_tool".Split(" ") | ForEach-Object {
    Create-File "$root/agents/tools/$_.py"
}

# -------------------------------
# templates
# -------------------------------
Create-Dir "$root/templates/latex"
Create-File "$root/templates/latex/default.tex.j2"
Create-File "$root/templates/latex/modern.tex.j2"

# -------------------------------
# storage
# -------------------------------
Create-Dir "$root/storage/pdfs"
Create-Dir "$root/storage/previews"
Create-Dir "$root/storage/chroma"

# -------------------------------
# migrations
# -------------------------------
Create-Dir "$root/migrations/versions"
Create-File "$root/migrations/env.py"
Create-File "$root/migrations/script.py.mako"
Create-File "$root/migrations/versions/001_initial_schema.py"
Create-File "$root/migrations/versions/002_seed_default_data.py"
Create-File "$root/migrations/versions/003_indexes.py"

# -------------------------------
# plugins
# -------------------------------
Create-Dir "$root/plugins"
Create-File "$root/plugins/__init__.py"
Create-File "$root/plugins/README.md"

# -------------------------------
# tests
# -------------------------------
Create-Dir "$root/tests/unit"
Create-Dir "$root/tests/integration"

Create-File "$root/tests/__init__.py"
Create-File "$root/tests/conftest.py"
Create-File "$root/tests/unit/test_memory.py"
Create-File "$root/tests/integration/test_full_flow.py"


# -------------------------------
# Done
# -------------------------------
Write-Host "✅ Project setup complete!"
Write-Host "👉 To start:"
Write-Host "cd backend"
Write-Host ".\venv\Scripts\Activate.ps1"
Write-Host "python main.py"