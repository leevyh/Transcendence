FROM elastic/elastic-agent:8.15.0

USER root
ENV DEBIAN_FRONTEND=noninteractive

COPY ./conf/elastic-agent.yml /usr/share/elastic-agent/elastic-agent.yml
RUN apt update -y && apt upgrade -y && apt install -y gettext moreutils && envsubst < /usr/share/elastic-agent/elastic-agent.yml | sponge /usr/share/elastic-agent/elastic-agent.yml