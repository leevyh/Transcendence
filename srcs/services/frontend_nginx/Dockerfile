FROM elastic/elastic-agent:8.14.1

USER root

ENV FLEET_ENROLL=true
ENV FLEET_URL=https://backend-fleet:8220
ENV FLEET_CA=/usr/share/elastic-agent/config/certs/ca/ca.crt

ENV ELASTIC_AGENT_CERT=/usr/share/elastic-agent/config/certs/backend-fleet/backend-fleet.crt
ENV ELASTIC_AGENT_CERT_KEY=/usr/share/elastic-agent/config/certs/backend-fleet/backend-fleet.key

ENV KIBANA_HOST=https://backend-kibana:5601
ENV KIBANA_FLEET_USERNAME=elastic
ENV KIBANA_FLEET_PASSWORD=changeme
ENV KIBANA_FLEET_CA=/usr/share/elastic-agent/config/certs/ca/ca.crt

RUN apt update -y && apt upgrade -y
RUN apt install -y nginx openssl

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
COPY ./conf/elastic-agent.sh /elastic-agent.sh

RUN chmod +x /elastic-agent.sh

ENTRYPOINT ["/elastic-agent.sh"]