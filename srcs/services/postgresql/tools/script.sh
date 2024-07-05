#!/bin/bash

echo "CREATE DATABASE $POSTGRES_DB;"

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE USER amugnier WITH PASSWORD 'NIQUE';
    CREATE DATABASE utilisateur OWNER amugnier;
    GRANT ALL PRIVILEGES ON DATABASE utilisateur TO amugnier;
EOSQL

echo "PostgreSQL initialization complete."
