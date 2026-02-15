terraform {
  required_providers {
    ibm = {
      source  = "IBM-Cloud/ibm"
      version = ">= 1.53.0"
    }
  }
}

# ─── Variables ──────────────────────────────────────
variable "ibmcloud_api_key" {
  description = "IBM Cloud API Key"
  type        = string
  sensitive   = true
}

variable "region" {
  description = "IBM Cloud Region"
  default     = "us-south"
}

variable "resource_group" {
  description = "Resource Group Name"
  default     = "default"
}

# ─── Provider ───────────────────────────────────────
provider "ibm" {
  ibmcloud_api_key = var.ibmcloud_api_key
  region           = var.region
}

# ─── Resource Group ─────────────────────────────────
data "ibm_resource_group" "group" {
  name = var.resource_group
}

# ─── Code Engine Project ────────────────────────────
resource "ibm_code_engine_project" "project" {
  name              = "ibm-consulting-project"
  resource_group_id = data.ibm_resource_group.group.id
}

# ─── Backend App ────────────────────────────────────
resource "ibm_code_engine_app" "backend" {
  project_id      = ibm_code_engine_project.project.project_id
  name            = "ibm-consulting-api"
  image_reference = "icr.io/codeengine/helloworld" # Replaced by CI/CD after first push
  image_port      = 4000
  scale_min       = 1
  scale_max       = 5

  run_env_variables {
    name  = "NODE_ENV"
    value = "production"
  }
}

# ─── Frontend App ───────────────────────────────────
resource "ibm_code_engine_app" "frontend" {
  project_id      = ibm_code_engine_project.project.project_id
  name            = "ibm-consulting-web"
  image_reference = "icr.io/codeengine/helloworld" # Replaced by CI/CD after first push
  image_port      = 3000
  scale_min       = 1
  scale_max       = 5

  run_env_variables {
    name  = "NEXT_PUBLIC_API_URL"
    value = ibm_code_engine_app.backend.endpoint
  }
}

# ─── Outputs ────────────────────────────────────────
output "project_id" {
  value = ibm_code_engine_project.project.id
}

output "backend_url" {
  value       = ibm_code_engine_app.backend.endpoint
  description = "Public URL for the Backend API"
}

output "frontend_url" {
  value       = ibm_code_engine_app.frontend.endpoint
  description = "Public URL for the Frontend App"
}
