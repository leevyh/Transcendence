#!/bin/bash

if [ ! -f /pga/certs/ssl.done ]; then
  echo "Creating certs";
  openssl req -x509 -nodes -out /pga/certs/prometheus.crt -keyout /pga/certs/prometheus.key -subj "/C=FR/ST=IDF/L=Paris/O=42/OU=42/CN=localhost";
  openssl req -x509 -nodes -out /pga/certs/grafana.crt -keyout /pga/certs/grafana.key -subj "/C=FR/ST=IDF/L=Paris/O=42/OU=42/CN=localhost";
  touch /pga/certs/ssl.done;
fi;

until false; do
  echo "Prometheus configuration successfully completed";
  sleep infinity;
done;

echo "Terminated";