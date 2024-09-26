FROM logstash:8.15.0

USER root

RUN mv /usr/share/logstash/pipeline/logstash.conf /usr/share/logstash/pipeline/logstash.reference.conf

COPY ./conf/l_django.conf /usr/share/logstash/pipeline/l_django.conf
COPY ./conf/l_postgresql.conf /usr/share/logstash/pipeline/l_postgresql.conf
COPY ./conf/logstash.yml /usr/share/logstash/config/logstash.yml