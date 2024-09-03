FROM elastic/elastic-agent:8.14.1

ENV FLEET_ENROLL=1
ENV FLEET_URL=https://backend-fleet:8220
ENV FLEET_CA=/usr/share/fleet/config/certs/ca/ca.crt

ENV FLEET_SERVER_ENABLE=1
ENV FLEET_SERVER_POLICY_ID=fleet-server-policy
ENV FLEET_SERVER_CERT=/usr/share/fleet/config/certs/backend-fleet/backend-fleet.crt
ENV FLEET_SERVER_CERT_KEY=/usr/share/fleet/config/certs/backend-fleet/backend-fleet.key

ENV KIBANA_HOST=https://backend-kibana:5601

ENV KIBANA_FLEET_SETUP=1
ENV KIBANA_FLEET_USERNAME=elastic
ENV KIBANA_FLEET_PASSWORD=changeme
ENV KIBANA_FLEET_CA=/usr/share/fleet/config/certs/ca/ca.crt

ENV FLEET_SERVER_ELASTICSEARCH_HOST=https://backend-elastic:9200
ENV FLEET_SERVER_ELASTICSEARCH_CA=/usr/share/fleet/config/certs/ca/ca.crt

