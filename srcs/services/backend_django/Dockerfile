FROM python:latest

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

RUN apt update -y && apt upgrade -y
RUN apt install -y python3 python3-pip --no-install-suggests --no-install-recommends postgresql-client --no-install-suggests --no-install-recommends

COPY ./conf/requirements.txt /home/app/requirements.txt

RUN pip3 install --upgrade pip
RUN pip3 install --no-cache-dir -r /home/app/requirements.txt

COPY ./conf/init.sh /home/app/init.sh
RUN chmod +x /home/app/init.sh

CMD ["/home/app/init.sh && daphne -b 0.0.0.0 -p 8000 backend.asgi:application"]