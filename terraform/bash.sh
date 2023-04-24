#!/usr/bin/env bash

gcloud projects add-iam-policy-binding dev-pct \
    --member=serviceAccount:dev-pct@dev-pct.iam.gserviceaccount.com \
    --role=roles/storage.admin \
    --role=roles/artifactregistry.admin \
    --role=roles/editor \
    --role=roles/container.admin
