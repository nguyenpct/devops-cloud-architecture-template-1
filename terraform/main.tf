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
  repository_id = var.PROJECT_REPO
  description   = "Docker repository "
  format        = "DOCKER"
}

//  Create cloud storage for build artifacts
resource "google_storage_bucket" "my-storage" {
  name = "${var.PROJECT_REPO}-gceme-artifacts"
  // https://cloud.google.com/storage/docs/locations
  location      = var.GCP_CLOUD_STORAGE_LOCATION
  force_destroy = true
}

//  Create Kubernetes Engine
resource "google_container_cluster" "my-cluster-staging" {
  name               = "devops-template-1-staging"
  location           = "asia-northeast1-a"
  initial_node_count = 3
  node_config {
    # Google recommends custom service accounts that have cloud-platform scope and permissions granted via IAM Roles.
    oauth_scopes = [
      "https://www.googleapis.com/auth/cloud-platform"
    ]
    machine_type = "e2-highcpu-4"
  }
  timeouts {
    create = "30m"
    update = "40m"
  }
}

resource "google_container_cluster" "my-cluster-production" {
  name               = "devops-template-1-production"
  location           = "asia-northeast1-a"
  initial_node_count = 3
  node_config {
    # Google recommends custom service accounts that have cloud-platform scope and permissions granted via IAM Roles.
    oauth_scopes = [
      "https://www.googleapis.com/auth/cloud-platform"
    ]
    machine_type = "e2-highcpu-4"
  }
  timeouts {
    create = "30m"
    update = "40m"
  }
}
