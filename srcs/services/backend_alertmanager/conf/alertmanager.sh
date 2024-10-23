#!/bin/bash

sed -i "s|WEBHOOK|$WEBHOOK|g" /etc/alertmanager/alertmanager.yml

/bin/alertmanager --config.file=/etc/alertmanager/alertmanager.yml --web.config.file=/etc/alertmanager/web-config.yml --storage.path=/alertmanager