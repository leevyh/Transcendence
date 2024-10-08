FROM nginx:1.27.2

RUN apt update -y && apt upgrade -y

COPY ./conf/nginx.conf /etc/nginx/nginx.conf

RUN mkdir -p /var/www/ft_transcendence
RUN chmod 777 /var/www/ft_transcendence
RUN chown -R www-data:www-data /var/www/ft_transcendence

CMD ["nginx", "-g", "daemon off;"]
