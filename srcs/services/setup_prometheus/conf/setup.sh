#!/bin/bash

if [ ! -f /pga/certs/ssl.done ]; then
  echo "Creating CA";

  mkdir -p /pga/certs/ca /pga/certs/prometheus /pga/certs/grafana /pga/certs/alertmanager /pga/certs/status;

  openssl genrsa -out /pga/certs/ca/ca.key 2048;

  openssl req -x509 -new -nodes -key /pga/certs/ca/ca.key -sha256 -subj "/C=FR/ST=IDF/L=Paris/O=42/OU=42" -addext "subjectAltName = DNS:backend-*, DNS:backend-prometheus, DNS:backend-alertmanager, DNS: backend-grafana, DNS:localhost" -out /pga/certs/ca/ca.crt;

  echo "Creating certs";
  echo -ne \
  "instances:\n"\
  "  - name: backend-prometheus\n"\
  "    dns:\n"\
  "      - backend-prometheus\n"\
  "      - localhost\n"\
  "    ip:\n"\
  "      - 127.0.0.1\n"\
  "  - name: backend-grafana\n"\
  "    dns:\n"\
  "      - backend-grafana\n"\
  "      - localhost\n"\
  "    ip:\n"\
  "      - 127.0.0.1\n"\
  "  - name: backend-alertmanager\n"\
  "    dns:\n"\
  "      - backend-alertmanager\n"\
  "      - localhost\n"\
  "    ip:\n"\
  "      - 127.0.0.1\n"\
  > /pga/certs/instances.yml;

  openssl genrsa -out /pga/certs/prometheus/prometheus.key 2048;
  openssl req -new -key /pga/certs/prometheus/prometheus.key -out /pga/certs/prometheus/prometheus.csr -subj "/C=FR/ST=IDF/L=Paris/O=42/OU=42/CN=localhost";
  openssl x509 -req -in /pga/certs/prometheus/prometheus.csr -CA /pga/certs/ca/ca.crt -CAkey /pga/certs/ca/ca.key -CAcreateserial -out /pga/certs/prometheus/prometheus.crt -sha256;
  rm /pga/certs/prometheus/prometheus.csr;

  openssl genrsa -out /pga/certs/grafana/grafana.key 2048;
  openssl req -new -key /pga/certs/grafana/grafana.key -out /pga/certs/grafana/grafana.csr -subj "/C=FR/ST=IDF/L=Paris/O=42/OU=42/CN=localhost";
  openssl x509 -req -in /pga/certs/grafana/grafana.csr -CA /pga/certs/ca/ca.crt -CAkey /pga/certs/ca/ca.key -CAcreateserial -out /pga/certs/grafana/grafana.crt -sha256;
  rm /pga/certs/grafana/grafana.csr;

  openssl genrsa -out /pga/certs/alertmanager/alertmanager.key 2048;
  openssl req -new -key /pga/certs/alertmanager/alertmanager.key -out /pga/certs/alertmanager/alertmanager.csr -subj "/C=FR/ST=IDF/L=Paris/O=42/OU=42/CN=localhost";
  openssl x509 -req -in /pga/certs/alertmanager/alertmanager.csr -CA /pga/certs/ca/ca.crt -CAkey /pga/certs/ca/ca.key -CAcreateserial -out /pga/certs/alertmanager/alertmanager.crt -sha256;
  rm /pga/certs/alertmanager/alertmanager.csr;

  touch /pga/certs/ssl.done;
fi;

while [ ! -f /pga/certs/status/prometheus.done ]; do
  if curl -s --insecure --cacert /pga/certs/ca/ca.crt https://backend-prometheus:9090/-/healthy | grep -q 'Prometheus Server is Healthy.'; then
    touch /pga/certs/status/prometheus.done;
  else
    sleep 5;
  fi;
done;

while [ ! -f /pga/certs/status/alertmanager.done ]; do
  if curl -s --insecure --cacert /pga/certs/ca/ca.crt https://backend-alertmanager:9093/-/healthy | grep -q 'OK'; then
    touch /pga/certs/status/alertmanager.done;
  else
    sleep 5;
  fi;
done;

while [ ! -f /pga/certs/status/grafana.done ]; do
  if curl -s --insecure --cacert /pga/certs/ca/ca.crt https://backend-grafana:3000/api/health | grep -q '\"database\": \"ok\"'; then
    touch /pga/certs/status/grafana.done;
  else
    sleep 5;
  fi;
done;

until false; do
  echo "Prometheus configuration successfully completed";
  sleep infinity;
done;

echo "Terminated";