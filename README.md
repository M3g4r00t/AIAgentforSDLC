# IBM Consulting Showcase — Cloud Native Reference App

> **Built with the [Antigravity SDLC Automation Framework](./sdlc_automation_prompt.md)** — An end-to-end AI-driven development lifecycle.

<br/>

## ✨ Overview

A premium, McKinsey-style web application showcasing **IBM Consulting** capabilities. This project demonstrates the full SDLC — from ideation to production deployment on **IBM Cloud** — using an AI-automated development workflow.

| Feature | Stack |
|---------|-------|
| **Frontend** | Next.js 14, React 18, Tailwind CSS, TypeScript |
| **Backend** | Node.js, Express, REST API |
| **Infrastructure** | IBM Cloud Code Engine, Terraform |
| **CI/CD** | GitHub Actions → IBM Container Registry → Code Engine |
| **Design** | IBM Design Language, Glassmorphism, Dark Mode |

---

## 🖥 Pages

| Page | Route | Description |
|------|-------|-------------|
| **Home** | `/` | Cinematic hero with animated gradient, stats counters, capability cards |
| **Services** | `/services` | 6 consulting capabilities with gradient icons and tags |
| **Insights** | `/insights` | Featured articles + article list feed |
| **Case Studies** | `/case-studies` | Client success stories with impact metrics |
| **Contact** | `/contact` | Glassmorphic contact form with info sidebar |

---

## 🚀 Quick Start

### Option 1: Docker (Recommended)

```bash
docker-compose up --build
```
- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend: [http://localhost:4000](http://localhost:4000)

### Option 2: Manual

```bash
# Backend
cd src/backend
npm install
npm run dev

# Frontend (new terminal)
cd src/frontend
npm install
npm run dev
```

---

## ☁️ Deploy to IBM Cloud

### Prerequisites
- IBM Cloud account with an API key
- Terraform CLI installed · [Install Guide](https://developer.hashicorp.com/terraform/install)

### Steps

```bash
# 1. Set your API key
export TF_VAR_ibmcloud_api_key="your-api-key"

# 2. Initialize & apply infrastructure
cd infra/ibm-cloud
terraform init
terraform apply

# 3. Get your public URLs
terraform output frontend_url
terraform output backend_url
```

CI/CD is configured via `.github/workflows/deploy.yml` — pushing to `main` will automatically build, test, and deploy.

**Required GitHub Secret**: `IBM_CLOUD_API_KEY`

---

## 📁 Project Structure

```
AIAgentforSDLC/
├── src/
│   ├── backend/             # Express REST API
│   │   ├── data/            # JSON data (insights, case studies)
│   │   ├── index.js         # Server entry
│   │   └── Dockerfile
│   └── frontend/            # Next.js 14 App
│       ├── app/             # Pages (App Router)
│       │   ├── page.tsx          # Home
│       │   ├── services/
│       │   ├── insights/
│       │   ├── case-studies/
│       │   └── contact/
│       ├── components/      # Navbar, Footer, AnimatedCounter
│       └── Dockerfile
├── infra/
│   └── ibm-cloud/           # Terraform (Code Engine)
├── .github/
│   └── workflows/           # CI/CD pipeline
├── docker-compose.yml
├── CONTRIBUTING.md           # How to contribute
├── sdlc_automation_prompt.md # AI agent instructions
└── framework_architecture.md # System design doc
```

---

## 🤝 Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for the full guide, including:
- Branch naming conventions
- Code standards (TypeScript, Conventional Commits)
- How to use Antigravity to generate contributions

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Health check |
| `GET` | `/api/insights` | List all insights (`?featured=true`, `?category=...`) |
| `GET` | `/api/insights/:slug` | Get single insight |
| `GET` | `/api/case-studies` | List all case studies (`?industry=...`) |
| `GET` | `/api/case-studies/:slug` | Get single case study |
| `GET` | `/api/services` | List all services |
| `POST` | `/api/contact` | Submit contact form |

---

## 🏗 SDLC Framework

This project was built using the **Antigravity SDLC Automation Framework**, which defines virtual developer roles (PM, Designer, Frontend Dev, Backend Dev, QA, DevOps) and orchestrates them through a structured workflow. See:
- [`sdlc_automation_prompt.md`](./sdlc_automation_prompt.md) — The prompt
- [`framework_architecture.md`](./framework_architecture.md) — The architecture

---

*Built with ❤️ by Google DeepMind Antigravity*
