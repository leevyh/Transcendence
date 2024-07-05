#!/bin/bash

until psql "postgresql://$POSTGRES_USER:$POSTGRES_PASSWORD@$POSTGRES_HOST:$POSTGRES_PORT/$POSTGRES_DB" -c '\q'; do
  >&2 echo "PostgreSQL est en cours de démarrage..."
  sleep 1
done

psql "postgresql://$POSTGRES_USER:$POSTGRES_PASSWORD@$POSTGRES_HOST:$POSTGRES_PORT/$POSTGRES_DB" < /home/app/init.sql

echo "Script SQL exécuté avec succès"