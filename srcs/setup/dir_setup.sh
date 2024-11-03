#!/bin/bash

if [ "x$1" = "x" ]; then
    echo "Path not specified"
    exit 1
else
  mkdir -p "$1/backend" "$1/backend/data" "$1/backend/certs" "$1/backend/logs"
  mkdir -p "$1/database" "$1/database/data" "$1/database/logs"
  mkdir -p "$1/elastic" "$1/elastic/ea" "$1/elastic/elastic" "$1/elastic/kibana" "$1/elastic/logstash" "$1/elastic/fleet" "$1/elastic/certs" "$1/elastic/logs" "$1/elastic/ea/proxy-nginx" "$1/elastic/ea/frontend-nginx"
  mkdir -p "$1/frontend"
  mkdir -p "$1/prometheus" "$1/prometheus/data" "$1/prometheus/certs"
  mkdir -p "$1/grafana"
  mkdir -p "$1/alertmanager"
fi