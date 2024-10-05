FROM elasticsearch:8.15.0

ENV ES_JAVA_OPTS="-Xms512m -Xmx512m"

COPY ./conf/elasticsearch.yml /usr/share/elasticsearch/config/elasticsearch.yml
COPY ./conf/elasticsearch-plugins.yml /usr/share/elasticsearch/config/elasticsearch-plugins.yml