//  Init service account for terraform
//  For local development, export GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account-key 

//  Manually create bucket for backend
terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "4.62.1"
    }
  }

  backend "gcs" {
    bucket = "tf-state-template-pct"
    prefix = "template-1"
  }
}

provider "google" {
  project = var.GCP_PROJECT
  region  = var.GCP_REGION
}

//  Create artifact registry repo
resource "google_artifact_registry_repository" "my-repo" {
  location      = var.GCP_REGION
  repository_id = var.PROJECT_IDENTIFY
  description   = "Docker repository "
  format        = "DOCKER"
}

//  Create cloud storage for build artifacts
resource "google_storage_bucket" "my-storage" {
  name = "${var.PROJECT_IDENTIFY}-gceme-artifacts"
  // https://cloud.google.com/storage/docs/locations
  location = var.GCP_CLOUD_STORAGE_LOCATION
}
