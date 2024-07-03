#!/bin/bash

# Start PostgreSQL

echo "Starting PostgreSQL..."

#service postgresql start
pg_ctl -D /var/lib/postgresql/data -l /var/lib/postgresql/logfile start
# Create user and database
echo "Creating user and database..."



su postgres <<EOF
  service postgresql start
EOF
#su postgres << EOF
#
#service postgresql start
#psql -c "CREATE USER amugnier WITH PASSWORD 'NIQUE';"
#psql -c "CREATE DATABASE user OWNER amugnier;"
#psql -c "GRANT ALL PRIVILEGES ON DATABASE user TO amugnier;"
#psql -c "GRANT ALL PRIVILEGES schema public TO amugnier;"
#
#EOF
