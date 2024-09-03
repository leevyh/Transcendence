FROM elastic/elastic-agent:8.14.1

USER root

ENV FLEET_ENROLL=true
ENV FLEET_URL=https://backend-fleet:8220
ENV FLEET_CA=/usr/share/elastic-agent/config/certs/ca/ca.crt

ENV ELASTIC_AGENT_CERT=/usr/share/elastic-agent/config/certs/backend-fleet/backend-fleet.crt
ENV ELASTIC_AGENT_CERT_KEY=/usr/share/elastic-agent/config/certs/backend-fleet/backend-fleet.key

ENV KIBANA_FLEET_HOST=https://backend-kibana:5601
ENV FLEET_TOKEN_POLICY_NAME=elastic-agent-policy

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