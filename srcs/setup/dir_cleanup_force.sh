#!/bin/bash

if [ "x$1" = "x" ]; then
    echo "Path not specified"
    exit 1
else
  docker run --rm --name dir_cleanup_force -u 0 -v "$(pwd)/$1":/data debian:latest sh -c "rm -rf /data/alertmanager /data/backend/logs /data/database/logs /data/elastic /data/grafana /data/prometheus"
fi