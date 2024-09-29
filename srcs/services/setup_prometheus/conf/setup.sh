#!/bin/bash

if [ ! -f /pga/certs/ssl.crt ] && [ ! -f /pga/certs/ssl.key ]; then
  echo "Creating certs";
  openssl req -x509 -nodes -out /pga/certs/ssl.crt -keyout /pga/certs/ssl.key -subj "/C=FR/ST=IDF/L=Paris/O=42/OU=42/CN=localhost";
fi;

until false; do
  echo "Prometheus configuration successfully completed";
  sleep infinity;
done;

echo "Terminated";