#!/bin/bash

python manage.py makemigrations --empty api
python manage.py makemigrations
python manage.py migrate