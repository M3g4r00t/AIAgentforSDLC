# Contributing to IBM Consulting Showcase

Thank you for your interest in contributing! This project was generated and managed using the **Antigravity SDLC Automation Framework**, and contributions from developers are welcome.

## 🚀 Quick Start

```bash
# 1. Fork & Clone
git clone https://github.com/<your-user>/AIAgentforSDLC.git
cd AIAgentforSDLC

# 2. Install Backend
cd src/backend && npm install

# 3. Install Frontend
cd ../frontend && npm install

# 4. Run with Docker Compose (recommended)
cd ../../
docker-compose up --build
```

## 📋 Contribution Workflow

1. **Create an Issue** — Describe the feature, bug, or improvement.
2. **Create a Branch** — Use the naming convention:
   - `feat/<short-description>` for features
   - `fix/<short-description>` for bug fixes
   - `docs/<short-description>` for documentation
3. **Make Changes** — Follow the code conventions below.
4. **Open a PR** — Target the `main` branch. CI will run automatically.
5. **Review** — A maintainer (or Antigravity) will review your PR.

## 🎨 Code Conventions

| Area | Standard |
|------|----------|
| **Frontend** | TypeScript, React functional components, Tailwind CSS |
| **Backend** | JavaScript (Node.js), Express, REST conventions |
| **Naming** | `camelCase` for variables, `PascalCase` for components |
| **Commits** | [Conventional Commits](https://www.conventionalcommits.org/) |
| **CSS** | Use Tailwind utilities; custom CSS in `globals.css` only |

## 🤖 Using Antigravity

If you have access to [Google Antigravity](https://cloud.google.com), you can use the SDLC prompt to generate contributions:

1. Open `sdlc_automation_prompt.md`.
2. Feed it to Antigravity with your feature request.
3. The agent will generate code following this project's patterns.

## 🧪 Testing

```bash
# Backend
cd src/backend && npm test

# Frontend
cd src/frontend && npm run lint
```

## 📁 Project Structure

```
AIAgentforSDLC/
├── src/
│   ├── backend/          # Express API
│   │   ├── data/         # JSON data files
│   │   ├── index.js      # Server entry point
│   │   └── Dockerfile
│   └── frontend/         # Next.js App
│       ├── app/          # App Router pages
│       ├── components/   # Shared components
│       └── Dockerfile
├── infra/
│   └── ibm-cloud/        # Terraform for IBM Cloud
├── .github/
│   └── workflows/        # CI/CD pipelines
├── docker-compose.yml
└── README.md
```
