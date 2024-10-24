FROM prom/alertmanager:v0.27.0

USER root
ENV DEBIAN_FRONTEND=noninteractive

COPY ./conf/alertmanager.yml /etc/alertmanager/alertmanager.yml
COPY ./conf/web-config.yml /etc/alertmanager/web-config.yml
COPY ./conf/alertmanager.sh /etc/alertmanager/alertmanager.sh

ENTRYPOINT ["/bin/sh", "/etc/alertmanager/alertmanager.sh"]