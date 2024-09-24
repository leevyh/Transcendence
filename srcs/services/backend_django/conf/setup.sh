#!/bin/bash

cd /var/app/ft_transcendence || exit 1

python manage.py makemigrations
python manage.py migrate

daphne -b 0.0.0.0 -p 8000 backend.asgi:application