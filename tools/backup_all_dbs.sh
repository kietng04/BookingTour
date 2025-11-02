#!/usr/bin/env bash
set -euo pipefail

# Backup all Postgres databases defined in docker-compose
# Creates timestamped .bak files (pg_dump -Fc) under db_backups/<timestamp>/

TIMESTAMP=$(date +%Y%m%d-%H%M%S)
OUT_DIR="db_backups/${TIMESTAMP}"
mkdir -p "${OUT_DIR}"

echo "Backing up databases to ${OUT_DIR}"

# function: backup one database from a container
backup_db() {
  local container="$1"; shift
  local dbname="$1"; shift
  local tmp_file="/tmp/${dbname}.bak"
  local out_file="${OUT_DIR}/${dbname}.bak"

  echo "  - ${container}:${dbname}"
  docker exec "${container}" sh -c "pg_dump -U postgres -F c -d '${dbname}' -f '${tmp_file}'"
  docker cp "${container}:${tmp_file}" "${out_file}"
  docker exec "${container}" rm -f "${tmp_file}" || true
}

# Main databases by service
backup_db postgres-db userdb
backup_db postgres-db tourdb
backup_db booking-db  bookingdb
backup_db payment-db  paymentdb

echo "Done. Files:"
ls -lh "${OUT_DIR}" || true

