FROM nginx:latest

RUN apt update -y && apt upgrade -y

# RUN mkdir -p /etc/nginx_proxy/ssl
# RUN apt install -y openssl --no-install-suggests --no-install-recommends
# RUN openssl req -x509 -nodes \
# 	-out /etc/nginx_proxy/ssl.crt \
# 	-keyout /etc/nginx_proxy/ssl.key \
# 	-subj "/C=FR/ST=Paris/L=Paris/O=42/OU=42/CN=localhost"

COPY ./conf/nginx.conf /etc/nginx/nginx.conf

CMD ["nginx", "-g", "daemon off;"]
