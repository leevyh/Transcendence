FROM debian:latest

ENV DEBIAN_FRONTEND=noninteractive

RUN apt update -y && apt upgrade -y && apt install -y openssl curl --no-install-suggests --no-install-recommends

COPY ./conf/setup.sh /config/setup.sh