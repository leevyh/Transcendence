#!/bin/bash

sleep 2

#python manage.py migrate api
#python manage.py makemigrations --empty api
python manage.py makemigrations
python manage.py migrate