FROM elastic/elastic-agent:8.15.0

USER root
ENV NON_INTERACTIVE=true

RUN apt update -y && apt upgrade -y && apt install -y nginx openssl

RUN mkdir -p /etc/nginx/ssl
RUN apt install -y openssl --no-install-suggests --no-install-recommends
RUN openssl req -x509 -nodes \
 	-out /etc/nginx/ssl/ssl.crt \
 	-keyout /etc/nginx/ssl/ssl.key \
 	-subj "/C=FR/ST=IDF/L=Paris/O=42/OU=42/CN=localhost"

COPY ./conf/nginx.conf /etc/nginx/nginx.conf
COPY ./conf/elastic-agent.sh /elastic-agent.sh

ENTRYPOINT ["/elastic-agent.sh"]