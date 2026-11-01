#!/usr/bin/env bash
# Deploys the API to Cloud Run. Secrets come from Secret Manager, never from this repo.
set -euo pipefail

PROJECT_ID="${PROJECT_ID:-humandesign-64ea8}"
REGION="${REGION:-asia-east1}"
SERVICE="${SERVICE:-humandesign-api}"

gcloud run deploy "$SERVICE" \
  --source server \
  --project "$PROJECT_ID" \
  --region "$REGION" \
  --allow-unauthenticated \
  --service-account "$SERVICE@$PROJECT_ID.iam.gserviceaccount.com" \
  --min-instances 0 \
  --max-instances 3 \
  --set-env-vars "WEB_BASE_URL=https://$PROJECT_ID.web.app,TRUST_PROXY_HOPS=2,GOOGLE_CLOUD_PROJECT=$PROJECT_ID" \
  --set-secrets "GMAIL_USER=GMAIL_USER:latest,GMAIL_APP_PASSWORD=GMAIL_APP_PASSWORD:latest" \
  --quiet
