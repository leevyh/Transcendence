FROM nginx:latest

RUN apt-get update -y && apt-get upgrade -y 

# Install SSL
# RUN mkdir -p /etc/nginx/ssl \
# 	&& apt install openssl --no-install-suggests --no-install-recommends -y

# RUN openssl req -x509 -nodes \
# 	-out /etc/nginx/ssl.crt \
# 	-keyout /etc/nginx/ssl.key \
# 	-subj "/C=FR/ST=Paris/L=Paris/O=42/OU=42/CN=localhost"

COPY /conf/nginx.conf /etc/nginx/conf.d/default.conf

COPY /frontend/index.html /usr/share/nginx
COPY /frontend/. /usr/share/nginx

RUN chmod 777 /usr/share/nginx && chown -R www-data:www-data /usr/share/nginx

CMD ["nginx", "-g", "daemon off;"]


# docker build -t nginx .
# docker run -it -p 8001:80 nginx
# docker system prune -af
