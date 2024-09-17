FROM nginx:1.27.0

RUN apt update -y && apt upgrade -y

# RUN mkdir -p /etc/nginx/ssl
# RUN apt install -y openssl --no-install-suggests --no-install-recommends
# RUN openssl req -x509 -nodes \
# 	-out /etc/nginx/ssl.crt \
# 	-keyout /etc/nginx/ssl.key \
# 	-subj "/C=FR/ST=Paris/L=Paris/O=42/OU=42/CN=localhost"

COPY ./conf/nginx.conf /etc/nginx/nginx.conf

CMD ["nginx", "-g", "daemon off;"]
