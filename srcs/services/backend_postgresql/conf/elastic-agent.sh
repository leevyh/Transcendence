#!/bin/bash

umask 0007
set -eo pipefail

service postgresql start

su - postgres -c "psql -c \"CREATE DATABASE ${POSTGRES_DB};\""
su - postgres -c "psql -tAc \"SELECT 1 FROM pg_roles WHERE rolname='${POSTGRES_USER}'\"" | grep -q 1 || \
su - postgres -c "psql -c \"CREATE ROLE ${POSTGRES_USER} LOGIN PASSWORD '${POSTGRES_PASSWORD}';\""
su - postgres -c "psql -c \"GRANT ALL PRIVILEGES ON DATABASE ${POSTGRES_DB} TO ${POSTGRES_USER};\""
su - postgres -c "psql -c \"ALTER ROLE ${POSTGRES_USER} WITH PASSWORD '${POSTGRES_PASSWORD}';\""
su - postgres -c "pg_ctlcluster $(pg_lsclusters | awk 'NR==2{print $1,$2}') stop"

service postgresql stop
service postgresql start

elastic-agent container "$@"
