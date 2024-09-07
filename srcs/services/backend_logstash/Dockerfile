FROM logstash:8.14.1

RUN rm -rf /usr/share/logstash/pipeline/logstash.conf
COPY ./config/logstash.conf /usr/share/logstash/pipeline/logstash.conf
COPY ./config/logstash.yml /usr/share/logstash/config/logstash.yml