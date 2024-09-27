#!/bin/bash

if [ "x$1" = "x" ]; then
    echo "Path not specified"
    exit 1
else
    rm -rf "$1/alertmanager" "$1/backend/logs" "$1/database/logs" "$1/elastic" "$1/grafana" "$1/prometheus"
fi
