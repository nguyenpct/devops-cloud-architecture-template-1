variable "GCP_PROJECT" {
  type    = string
  default = "dev-pct"
}

variable "GCP_REGION" {
  type    = string
  default = "asia-northeast1"
}

variable "GCP_CLOUD_STORAGE_LOCATION" {
  type = string
  // https://cloud.google.com/storage/docs/locations
  default = "ASIA-NORTHEAST1"
}

variable "PROJECT_IDENTIFY" {
  type    = string
  default = "devops-cloud-architecture-template-1-terraform"
}
