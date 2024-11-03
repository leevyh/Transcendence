#!/bin/bash

/bin/prometheus --config.file=/etc/prometheus/prometheus.yml --web.config.file=/etc/prometheus/web-config.yml --storage.tsdb.path=/prometheus --storage.tsdb.retention.time=30d --web.console.libraries=/usr/share/prometheus/console_libraries --web.console.templates=/usr/share/prometheus/consoles