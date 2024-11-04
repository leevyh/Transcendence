#!/bin/bash

sleep 2

#python manage.py migrate api
#python manage.py makemigrations --empty api
python manage.py makemigrations

#################Line to uncomment if you want to load data from a json file#################
#python manage.py loaddata /home/app/tools/data.json

python manage.py migrate