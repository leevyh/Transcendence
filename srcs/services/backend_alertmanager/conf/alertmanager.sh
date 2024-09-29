#!/bin/bash

sed -i "s|ALERT_PASSWORD|$ALERT_PASSWORD|g" /config/alertmanager.yml
sed -i "s|ALERT_EMAIL|$ALERT_EMAIL|g" /config/alertmanager.yml

/bin/alertmanager --config.file=/config/alertmanager.yml --storage.path=/alertmanager