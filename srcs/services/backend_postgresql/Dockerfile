FROM elastic/elastic-agent:8.15.0

USER root
ENV DEBIAN_FRONTEND=noninteractive

RUN apt update -y && apt upgrade -y
RUN apt install -y postgresql postgresql-contrib

COPY ./conf/postgresql.conf /var/lib/postgresql/data/postgresql.conf
COPY ./conf/elastic-agent.sh /elastic-agent.sh

RUN chmod +x /elastic-agent.sh

ENTRYPOINT ["/elastic-agent.sh"]