FROM elastic/elastic-agent:8.14.1

ENV FLEET_ENROLL=1
ENV FLEET_URL=https://backend-fleet:8220
ENV FLEET_ENROLLMENT_TOKEN="UVlLZWg1QUJNQXJVLUFPTmxqeTM6aHIzeVBlV0dTRmlNYmk5NWgtUkhwZw=="
ENV FLEET_CA=/usr/share/elastic-agent/config/certs/ca/ca.crt

USER root

RUN apt update -y && apt upgrade -y
RUN apt install -y nginx openssl

# RUN mkdir -p /etc/nginx/ssl
# RUN apt install -y openssl --no-install-suggests --no-install-recommends
# RUN openssl req -x509 -nodes \
# 	-out /etc/nginx/ssl.crt \
# 	-keyout /etc/nginx/ssl.key \
# 	-subj "/C=FR/ST=Paris/L=Paris/O=42/OU=42/CN=localhost"

COPY ./conf/nginx.conf /etc/nginx/nginx.conf

USER elastic-agent

