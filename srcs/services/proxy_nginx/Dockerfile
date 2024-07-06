FROM nginx:latest

RUN apt update -y && apt upgrade -y
RUN apt install -y curl docker.io --no-install-suggests --no-install-recommends

# RUN mkdir -p /etc/nginx/ssl
# RUN apt install -y openssl --no-install-suggests --no-install-recommends
# RUN openssl req -x509 -nodes \
# 	-out /etc/nginx/ssl.crt \
# 	-keyout /etc/nginx/ssl.key \
# 	-subj "/C=FR/ST=Paris/L=Paris/O=42/OU=42/CN=localhost"

COPY ./conf/nginx.conf /etc/nginx/nginx.conf
COPY ./conf/esa.sh /esa.sh

RUN chmod +x /esa.sh