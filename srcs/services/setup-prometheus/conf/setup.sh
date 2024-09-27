#!/bin/bash

if [ ! -f /certs/ssl.crt ] && [ ! -f /certs/ssl.key ]; then
  echo "Creating certs";
  openssl req -x509 -nodes -out /certs/ssl.crt -keyout /certs/ssl.key -subj "/C=FR/ST=IDF/L=Paris/O=42/OU=42/CN=localhost";
fi;

until false; do
  echo "Prometheus configuration successfully completed";
  sleep infinity;
done;

echo "Terminated";