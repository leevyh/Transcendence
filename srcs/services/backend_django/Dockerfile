FROM python:3.12.4

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /home/app/

RUN apt update -y && apt upgrade -y
RUN apt install -y python3 python3-pip --no-install-suggests --no-install-recommends postgresql-client --no-install-suggests --no-install-recommends

COPY ./tools/requirements.txt /home/app/requirements.txt

RUN pip3 install --upgrade pip
RUN pip3 install --no-cache-dir -r /home/app/requirements.txt

COPY ./tools/script.sh /home/app/init.sh
#COPY ./tools/script.sql /home/app/init.sql
RUN chmod +x /home/app/init.sh
#RUN chmod +x /home/app/init.sql

COPY . .

#CMD ["sh", "-c", "/home/app/init.sh && gunicorn backend.wsgi:application --bind 0.0.0.0:8000"]

CMD ["sh", "-c", "/home/app/init.sh && daphne -b 0.0.0.0 -p 8000 backend.asgi:application"]