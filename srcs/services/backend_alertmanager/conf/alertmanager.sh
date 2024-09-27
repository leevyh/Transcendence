#!/bin/bash

sed -i "s|ALERT_EMAIL_PASSWORD|$ALERT_EMAIL_PASSWORD|g" /config/alertmanager.yml
sed -i "s|ALERT_EMAIL|$ALERT_EMAIL|g" /config/alertmanager.yml

/bin/alertmanager --config.file=/config/alertmanager.yml --storage.path=/alertmanager