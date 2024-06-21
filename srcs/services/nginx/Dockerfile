FROM nginx:latest

RUN apt-get update && apt-get upgrade

# RUN mkdir -p /etc/nginx/ssl \
# 	&& apt install openssl --no-install-suggests --no-install-recommends -y

# RUN openssl req -x509 -nodes \
# 	-out /etc/nginx/ssl.crt \
# 	-keyout /etc/nginx/ssl.key \
# 	-subj "/C=FR/ST=Paris/L=Paris/O=42/OU=42/CN=localhost"

COPY /conf/nginx.conf /etc/nginx/conf.d/default.conf

COPY /frontend/index.html /var/www/html
COPY /frontend/css/index.css /var/www/html
COPY /frontend/js/index.js /var/www/html

RUN chmod 777 /var/www/html && chown -R www-data:www-data /var/www/html

# CMD ["nginx", "-g", "daemon off;"]


# docker build -t nginx .
# docker run -it -p 8001:80 nginx
# docker system prune -af
