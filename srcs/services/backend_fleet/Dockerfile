FROM elastic/elastic-agent:8.15.0

USER root

COPY ./conf/elastic-agent.yml /usr/share/elastic-agent/elastic-agent.yml
RUN apt update -y && apt upgrade -y && apt install -y gettext moreutils && envsubst < /usr/share/elastic-agent/elastic-agent.yml | sponge /usr/share/elastic-agent/elastic-agent.yml

RUN sed -i '13i sed -i "s|KIBANA_PASSWORD|$KIBANA_PASSWORD|g" /usr/share/elastic-agent/elastic-agent.yml' /usr/local/bin/docker-entrypoint