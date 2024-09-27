FROM prom/alertmanager:v0.27.0

USER root
ENV DEBIAN_FRONTEND=noninteractive

#RUN apt update -y && apt upgrade -y && apt install -y gettext moreutils

COPY ./conf/alertmanager.yml /config/alertmanager.yml
COPY ./conf/alertmanager.sh /config/alertmanager.sh

RUN chmod +x /config/alertmanager.sh

ENTRYPOINT ["/bin/sh", "/config/alertmanager.sh"]