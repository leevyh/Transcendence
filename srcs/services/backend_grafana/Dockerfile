FROM grafana/grafana:11.2.1

USER root

COPY ./conf/grafana.ini /etc/grafana/grafana.ini
COPY ./conf/datasources.yml /etc/grafana/provisioning/datasources/datasources.yml

RUN sed -i '2i sed -i "s|GRAFANA_USER|$GRAFANA_USER|g" /etc/grafana/grafana.ini' /run.sh
RUN sed -i '3i sed -i "s|GRAFANA_PASSWORD|$GRAFANA_PASSWORD|g" /etc/grafana/grafana.ini' /run.sh
RUN sed -i '4i sed -i "s|POSTGRES_PASSWORD|$POSTGRES_PASSWORD|g" /etc/grafana/provisioning/datasources/datasources.yml' /run.sh
RUN sed -i '5i sed -i "s|ELASTIC_PASSWORD|$ELASTIC_PASSWORD|g" /etc/grafana/provisioning/datasources/datasources.yml' /run.sh
