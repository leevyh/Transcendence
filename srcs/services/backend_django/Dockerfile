FROM python:3.12.7

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /var/app/ft_transcendence/

RUN apt update -y && apt upgrade -y
RUN apt install -y python3 python3-pip postgresql-client --no-install-suggests --no-install-recommends

COPY ./conf/requirements.txt /usr/lib/python3/packages/pip.txt
RUN pip3 install --upgrade pip
RUN pip3 install --no-cache-dir -r /usr/lib/python3/packages/pip.txt

COPY ./conf/setup.sh /var/app/setup.sh
RUN chmod +x /var/app/setup.sh

ENTRYPOINT ["/var/app/setup.sh"]