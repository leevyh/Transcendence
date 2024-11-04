FROM logstash:8.15.0

USER root

RUN mv /usr/share/logstash/pipeline/logstash.conf /usr/share/logstash/pipeline/logstash.reference.conf

COPY ./conf/django.conf /usr/share/logstash/pipeline/django/p_django.conf
COPY ./conf/postgresql.conf /usr/share/logstash/pipeline/postgresql/p_postgresql.conf
COPY ./conf/logstash.yml /usr/share/logstash/config/logstash.yml
COPY ./conf/pipelines.yml /usr/share/logstash/config/pipelines.yml