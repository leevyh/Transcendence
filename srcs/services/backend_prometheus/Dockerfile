FROM prom/prometheus:v2.54.1

USER root

COPY ./conf/prometheus.yml /etc/prometheus/prometheus.yml
COPY ./conf/rules.yml /etc/prometheus/rules.yml
COPY ./conf/web-config.yml /etc/prometheus/web-config.yml
COPY ./conf/prometheus.sh /etc/prometheus/prometheus.sh

RUN chmod +x /etc/prometheus/prometheus.sh

ENTRYPOINT ["/bin/sh", "/etc/prometheus/prometheus.sh"]