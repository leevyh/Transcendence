FROM elastic/elastic-agent:8.14.1

USER root

ENV FLEET_ENROLL=1
ENV FLEET_URL=https://backend-fleet:8220
ENV FLEET_ENROLLMENT_TOKEN="UU9Xb2twQUJwNWZiMF9fdVp2U286eVQ3T2RValZRVW1HNXF4NWcydzlsZw=="
ENV FLEET_CA=/usr/share/elastic-agent/config/certs/ca/ca.crt

ENV ELASTIC_AGENT_CERT=/usr/share/elastic-agent/config/certs/backend-fleet/backend-fleet.crt
ENV ELASTIC_AGENT_CERT_KEY=/usr/share/elastic-agent/config/certs/backend-fleet/backend-fleet.key

ENV ELASTICSEARCH_HOST=https://backend-elastic:9200
ENV ELASTICSEARCH_USERNAME=elastic
ENV ELASTICSEARCH_PASSWORD=changeme
ENV ELASTICSEARCH_CA=/usr/share/elastic-agent/config/certs/ca/ca.crt

ENV FLEET_SERVER_ES_CERT=/usr/share/elastic-agent/config/certs/backend-elastic/backend-elastic.crt
ENV FLEET_SERVER_ES_CERT_KEY=/usr/share/elastic-agent/config/certs/backend-elastic/backend-elastic.key

ENV KIBANA_CA=/usr/share/elastic-agent/config/certs/ca/ca.crt

ENV NON_INTERACTIVE=true

RUN apt update -y && apt upgrade -y
RUN apt install -y nginx openssl

# RUN mkdir -p /etc/nginx/ssl
# RUN apt install -y openssl --no-install-suggests --no-install-recommends
# RUN openssl req -x509 -nodes \
# 	-out /etc/nginx/ssl.crt \
# 	-keyout /etc/nginx/ssl.key \
# 	-subj "/C=FR/ST=Paris/L=Paris/O=42/OU=42/CN=localhost"

COPY ./conf/nginx.conf /etc/nginx/nginx.conf
COPY ./conf/elastic-agent.sh /usr/local/bin/docker-entrypoint
RUN chmod +x /usr/local/bin/docker-entrypoint