FROM nginx:1.27

USER root
ENV NON_INTERACTIVE=true

RUN apt update -y && apt upgrade -y && apt install -y nginx openssl

RUN mkdir -p /etc/nginx/ssl
RUN apt install -y openssl --no-install-suggests --no-install-recommends
RUN openssl req -x509 -nodes \
 	-out /etc/nginx/ssl/ssl.crt \
 	-keyout /etc/nginx/ssl/ssl.key \
 	-subj "/C=FR/ST=IDF/L=Paris/O=42/OU=42/CN=localhost"

RUN mkdir -p /var/www/ft_transcendence
RUN chmod 777 /var/www/ft_transcendence
RUN chown -R www-data:www-data /var/www/ft_transcendence

COPY ./conf/nginx.conf /etc/nginx/nginx.conf