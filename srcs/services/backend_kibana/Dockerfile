FROM kibana:8.15.0

USER root
ENV DEBIAN_FRONTEND=noninteractive

COPY ./conf/kibana.yml /usr/share/kibana/config/kibana.yml
RUN apt update -y && apt upgrade -y && apt install -y gettext moreutils

RUN sed -i '463i envsubst < /usr/share/kibana/config/kibana.yml | sponge /usr/share/kibana/config/kibana.yml' /usr/local/bin/kibana-docker

USER kibana