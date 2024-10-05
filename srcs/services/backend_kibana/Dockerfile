FROM kibana:8.15.0

USER root

COPY ./conf/kibana.yml /usr/share/kibana/config/kibana.yml

RUN sed -i '463i sed -i "s|KIBANA_PASSWORD|$KIBANA_PASSWORD|g" /usr/share/kibana/config/kibana.yml' /usr/local/bin/kibana-docker

USER kibana