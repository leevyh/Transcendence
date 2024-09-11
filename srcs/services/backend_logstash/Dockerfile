FROM logstash:8.14.1

USER root

RUN mv /usr/share/logstash/pipeline/logstash.conf /usr/share/logstash/pipeline/logstash.reference.conf

COPY ./conf/logstash.conf /usr/share/logstash/pipeline/logstash.conf
COPY ./conf/logstash.yml /usr/share/logstash/config/logstash.yml