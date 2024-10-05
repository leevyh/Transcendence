FROM quay.io/prometheuscommunity/elasticsearch-exporter:v1.8.0

COPY ./conf/setup.sh /setup.sh

ENTRYPOINT ["/bin/sh", "/setup.sh"]