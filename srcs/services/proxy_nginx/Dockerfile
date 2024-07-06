FROM nginx:latest

RUN apt update -y && apt upgrade -y
RUN apt install -y curl apt-utils

# RUN mkdir -p /etc/nginx/ssl
# RUN apt install -y openssl --no-install-suggests --no-install-recommends
# RUN openssl req -x509 -nodes \
# 	-out /etc/nginx/ssl.crt \
# 	-keyout /etc/nginx/ssl.key \
# 	-subj "/C=FR/ST=Paris/L=Paris/O=42/OU=42/CN=localhost"

RUN curl -fsSL https://get.docker.com -o docker-setup.sh && sh ./docker-setup.sh
RUN dockerd &

COPY ./conf/nginx.conf /etc/nginx/nginx.conf
COPY ./conf/setup.sh /setup.sh
RUN chmod +x /setup.sh

ARG ENROLLMENT_TOKEN
CMD ["/setup.sh", "${ENROLLMENT_TOKEN}"]
