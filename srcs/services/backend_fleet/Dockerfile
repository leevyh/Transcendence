
ENV FLEET_ENROLL=true
ENV FLEET_SERVER_ENABLE=true
ENV FLEET_URL=https://backend-fleet:8220
ENV FLEET_SERVER_POLICY_ID=fleet-server-policy
ENV FLEET_SERVER_CERT=/usr/share/elastic-agent/config/certs/backend-fleet/backend-fleet.crt
ENV FLEET_SERVER_CERT_KEY=/usr/share/elastic-agent/config/certs/backend-fleet/backend-fleet.key
ENV FLEET_CA=/usr/share/elastic-agent/config/certs/ca/ca.crt
FROM elastic/elastic-agent:8.15.0

ENV KIBANA_FLEET_SETUP=true
ENV KIBANA_HOST=https://backend-kibana:5601
ENV KIBANA_FLEET_USERNAME=elastic
ENV KIBANA_FLEET_PASSWORD=changeme
ENV KIBANA_FLEET_CA=/usr/share/elastic-agent/config/certs/ca/ca.crt

ENV FLEET_SERVER_ELASTICSEARCH_HOST=https://backend-elastic:9200
ENV FLEET_SERVER_ELASTICSEARCH_CA=/usr/share/elastic-agent/config/certs/ca/ca.crt

COPY ./conf/elastic-agent.yml /usr/share/elastic-agent/elastic-agent.yml