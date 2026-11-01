#!/usr/bin/env bash
# One-time, idempotent GCP setup. Requires the project to be on the Blaze plan.
# It asks for Gmail values interactively; they go straight to Secret Manager.
set -euo pipefail

PROJECT_ID="${PROJECT_ID:-humandesign-64ea8}"
REGION="${REGION:-asia-east1}"
SERVICE="${SERVICE:-humandesign-api}"
GITHUB_REPO="${GITHUB_REPO:-ShackArbeit/HumanDesign}"
POOL=github
PROVIDER=github-actions

RUNTIME_SA="$SERVICE@$PROJECT_ID.iam.gserviceaccount.com"
DEPLOY_SA="github-deployer@$PROJECT_ID.iam.gserviceaccount.com"

gc() { gcloud "$@" --project "$PROJECT_ID"; }

gc services enable run.googleapis.com artifactregistry.googleapis.com \
  cloudbuild.googleapis.com secretmanager.googleapis.com firestore.googleapis.com \
  iamcredentials.googleapis.com firebasehosting.googleapis.com firebase.googleapis.com \
  firebaserules.googleapis.com

gc firestore databases describe --database='(default)' >/dev/null 2>&1 ||
  gc firestore databases create --location="$REGION" --type=firestore-native

for sa in "$SERVICE" github-deployer; do
  gc iam service-accounts describe "$sa@$PROJECT_ID.iam.gserviceaccount.com" >/dev/null 2>&1 ||
    gc iam service-accounts create "$sa"
done

bind() {
  gcloud projects add-iam-policy-binding "$PROJECT_ID" \
    --member="serviceAccount:$1" --role="$2" --condition=None --quiet >/dev/null
}

bind "$RUNTIME_SA" roles/datastore.user
bind "$RUNTIME_SA" roles/secretmanager.secretAccessor
for role in roles/run.admin roles/iam.serviceAccountUser roles/cloudbuild.builds.editor \
  roles/artifactregistry.admin roles/storage.admin roles/serviceusage.serviceUsageConsumer \
  roles/firebase.admin; do
  bind "$DEPLOY_SA" "$role"
done

for name in GMAIL_USER GMAIL_APP_PASSWORD; do
  gc secrets describe "$name" >/dev/null 2>&1 ||
    gc secrets create "$name" --replication-policy=automatic
  if [ -z "$(gc secrets versions list "$name" --filter='state=enabled' --format='value(name)')" ]; then
    read -r -s -p "Value for $name: " value
    echo
    printf '%s' "$value" | gc secrets versions add "$name" --data-file=-
    unset value
  fi
done

gc iam workload-identity-pools describe "$POOL" --location=global >/dev/null 2>&1 ||
  gc iam workload-identity-pools create "$POOL" --location=global
gc iam workload-identity-pools providers describe "$PROVIDER" \
  --location=global --workload-identity-pool="$POOL" >/dev/null 2>&1 ||
  gc iam workload-identity-pools providers create-oidc "$PROVIDER" \
    --location=global --workload-identity-pool="$POOL" \
    --issuer-uri=https://token.actions.githubusercontent.com \
    --attribute-mapping='google.subject=assertion.sub,attribute.repository=assertion.repository' \
    --attribute-condition="assertion.repository == '$GITHUB_REPO'"

POOL_NAME=$(gc iam workload-identity-pools describe "$POOL" --location=global --format='value(name)')
gc iam service-accounts add-iam-policy-binding "$DEPLOY_SA" \
  --role=roles/iam.workloadIdentityUser \
  --member="principalSet://iam.googleapis.com/$POOL_NAME/attribute.repository/$GITHUB_REPO" \
  --quiet >/dev/null

echo
echo 'Set these as GitHub repository variables (Settings > Secrets and variables > Actions > Variables):'
echo "  WIF_PROVIDER=$POOL_NAME/providers/$PROVIDER"
echo "  DEPLOY_SERVICE_ACCOUNT=$DEPLOY_SA"
