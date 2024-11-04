#!/bin/bash

cd /var/app/ft_transcendence || exit 1

python manage.py makemigrations
python manage.py migrate

daphne -e ssl:port=8000:privateKey=/etc/nginx/ssl/ssl.key:certKey=/etc/nginx/ssl/ssl.crt backend.asgi:application