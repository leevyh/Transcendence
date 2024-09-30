#!/bin/bash

if [ "x$1" = "x" ]; then
    echo "Path not specified"
    exit 1
fi

if [ ! -f "$1/42api.env" ]; then
    echo "42api.env file not found"
    exit 1
elif [ ! -f "$1/alertmanager.env" ]; then
    echo "alertmanager.env file not found"
    exit 1
elif [ ! -f "$1/elastic.env" ]; then
    echo "elastic.env file not found"
    exit 1
elif [ ! -f "$1/fleet.env" ]; then
    echo "fleet.env file not found"
    exit 1
elif [ ! -f "$1/grafana.env" ]; then
  echo "grafana.env file not found"
  exit 1
elif [ ! -f "$1/kibana.env" ]; then
    echo "kibana.env file not found"
    exit 1
elif [ ! -f "$1/postgresql.env" ]; then
    echo "postgresql.env file not found"
    exit 1
fi