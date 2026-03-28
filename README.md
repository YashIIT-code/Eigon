# Eigon — AI Story-to-Video Platform

> Transform your stories into cinematic videos with the power of AI.

![Eigon](https://img.shields.io/badge/Eigon-AI%20SaaS-blueviolet?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)

## 🎬 Overview

Eigon is a full-stack AI SaaS platform that converts stories (text or audio) into cinematic short videos. The platform uses LLMs for scene decomposition, Stable Diffusion for image generation, TTS for narration, and FFmpeg for video assembly.

## 🏗 Architecture

```
┌──────────────┐     REST API     ┌──────────────┐     BullMQ/Redis    ┌──────────────┐
│   Frontend   │ ──────────────▶ │   Backend    │ ──────────────────▶ │  AI Worker   │
│  React+Vite  │ ◀────────────── │  Express+PG  │ ◀────────────────── │   Python     │
└──────────────┘     Polling      └──────────────┘     Job Results     └──────────────┘
                                        │                                     │
                                        ▼                                     ▼
                                  ┌──────────┐                          ┌──────────┐
                                  │PostgreSQL│                          │  AWS S3  │
                                  └──────────┘                          └──────────┘
```

## 📁 Project Structure

```
eigon/
├── frontend/          # React + Vite + Tailwind
├── backend/           # Node.js + Express API
├── ai-worker/         # Python AI pipeline
├── infra/             # Nginx, deployment configs
├── .github/workflows/ # CI/CD
├── docker-compose.yml
├── .env.example
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.10+
- PostgreSQL 15+
- Redis 7+
- Docker & Docker Compose (optional)

### Local Development

1. **Clone & setup environment**
```bash
cp .env.example .env
# Edit .env with your values
```

2. **Start with Docker Compose**
```bash
docker-compose up --build
```

3. **Or start services individually:**

```bash
# Terminal 1 — Backend
cd backend && npm install && npm run dev

# Terminal 2 — Frontend  
cd frontend && npm install && npm run dev

# Terminal 3 — AI Worker
cd ai-worker && pip install -r requirements.txt && python main.py
```

4. **Access the app**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- API Health: http://localhost:5000/api/health

## 🔑 Environment Variables

See [`.env.example`](.env.example) for all required environment variables.

## 📜 License

MIT
