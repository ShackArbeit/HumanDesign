#!/usr/bin/env bash
# Post-deploy checks from CLAUDE.md section 11. Usage: smoke-test.sh https://site.web.app
set -euo pipefail

BASE_URL="${1:?usage: smoke-test.sh <base-url>}"
FROM=$(date -u +%F)
TO=$(date -u -d '+6 days' +%F)

check() {
  local path="$1" expected="$2" status
  status=$(curl -s -o /dev/null -w '%{http_code}' --max-time 60 "$BASE_URL$path")
  if [ "$status" != "$expected" ]; then
    echo "FAIL $path: expected $expected, got $status"
    exit 1
  fi
  echo "PASS $path"
}

check /api/v1/health 200
check "/api/v1/availability?from=$FROM&to=$TO&durationMin=60" 200
check / 200
check /human/types 200
check /booking 200
check /api/v1/nope 404
