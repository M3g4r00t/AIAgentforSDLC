# CI/CD Pipeline Guide

This project follows a 3-tier CI/CD strategy using **GitHub Actions** and **IBM Cloud Code Engine**.

## 🌍 Environments

| Env | Branch | URL/Apps | Purpose |
|-----|--------|----------|---------|
| **DEV** | `feature/*` | Localhost | Local development and testing via Docker Compose. |
| **QA** | `develop` | `ibm-consulting-web-qa` | Integration testing and QA review in the cloud. |
| **PRD** | `master` | `ibm-consulting-web` | Live production environment. |

## 🚀 Workflows

### 1. PR Validation (`ci-pr-validation.yml`)
Runs automatically on any Pull Request targeting `develop` or `master`.
- **Checks**:
    - Backend Unit Tests (`npm test`)
    - Frontend Linting & Build (`npm run lint`, `npm run build`)
    - End-to-End Tests (`Playwright`)
- **Requirement**: Must pass before merging.

### 2. CD to QA (`cd-qa.yml`)
Runs automatically when code is pushed (or merged) to the `develop` branch.
- **Actions**:
    - Builds Docker images tagged with `qa-latest`.
    - Deploys to `ibm-consulting-api-qa` and `ibm-consulting-web-qa` on IBM Cloud.

### 3. CD to Production (`cd-prod.yml`)
Runs automatically when code is pushed (or merged) to the `master` branch.
- **Actions**:
    - Builds Docker images tagged with `latest` and the commit SHA.
    - Deploys to `ibm-consulting-api` and `ibm-consulting-web` on IBM Cloud.

## 🛠 Setup Requirements

### 1. GitHub Repository Settings
To enforce this process, configure **Branch Protection Rules** in GitHub:

**Rule for `master`:**
- [x] Require a pull request before merging
- [x] Require status checks to pass before merging (`test-backend`, `test-frontend`, `test-e2e`)

**Rule for `develop`:**
- [x] Require a pull request before merging
- [x] Require status checks to pass before merging

### 2. IBM Cloud Setup
The `qa` workflows require separate Code Engine applications. You must create them manually (or via CLI) if they don't exist:

```bash
# Create QA Backend
ibmcloud ce app create --name ibm-consulting-api-qa --image us.icr.io/ibm-consulting/ibm-consulting-api:qa-latest --min-scale 1 --registry-secret ibm-consulting-secret

# Create QA Frontend
ibmcloud ce app create --name ibm-consulting-web-qa --image us.icr.io/ibm-consulting/ibm-consulting-web:qa-latest --min-scale 1 --registry-secret ibm-consulting-secret --env NEXT_PUBLIC_API_URL=https://ibm-consulting-api-qa.<your-region>.codeengine.appdomain.cloud
```

### 3. Secrets
Ensure `IBM_CLOUD_API_KEY` is set in your repository secrets.
