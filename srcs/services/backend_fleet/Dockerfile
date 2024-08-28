FROM elastic/elastic-agent-complete:8.14.1

ENV SERVER_NAME=backend-fleet

ENV ELASTICSEARCH_HOST=https://backend-elastic:9200
ENV ELASTICSEARCH_USERNAME=elastic
ENV ELASTICSEARCH_PASSWORD=changeme
ENV ELASTICSEARCH_CA=/usr/share/fleet/config/certs/ca/ca.crt

ENV KIBANA_HOST=https://backend-kibana:5601
ENV KIBANA_USERNAME=elastic
ENV KIBANA_PASSWORD=changeme
ENV KIBANA_CA=/usr/share/fleet/config/certs/ca/ca.crt

ENV FLEET_SERVER_ENABLE=true
ENV FLEET_URL=https://backend-fleet:8220
ENV FLEET_SERVER_POLICY_NAME=fleet-server-policy
ENV FLEET_CA=/usr/share/fleet/config/certs/ca/ca.crt
ENV FLEET_SERVER_CERT=/usr/share/fleet/config/certs/backend-fleet/backend-fleet.crt
ENV FLEET_SERVER_CERT_KEY=/usr/share/fleet/config/certs/backend-fleet/backend-fleet.key
