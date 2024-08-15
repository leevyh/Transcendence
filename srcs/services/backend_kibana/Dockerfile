FROM kibana:8.14.1

#ENV SERVER_NAME=backend-kibana
#ENV SERVER_HOST=0.0.0.0
#ENV SERVER_PORT=5601
#
#ENV SERVER_SSL_CERTIFICATE=/usr/share/kibana/config/certs/backend-kibana/backend-kibana.crt
#ENV SERVER_SSL_KEY=/usr/share/kibana/config/certs/backend-kibana/backend-kibana.key
#ENV SERVER_SSL_CERTIFICATEAUTHORITIES=/usr/share/kibana/config/certs/ca/ca.crt
#
#ENV ELASTICSEARCH_HOSTS=https://backend-elastic:9200
#ENV ELASTICSEARCH_SSL_CERTIFICATE=/usr/share/kibana/config/certs/backend-kibana/backend-kibana.crt
#ENV ELASTICSEARCH_SSL_KEY=/usr/share/kibana/config/certs/backend-kibana/backend-kibana.key
#ENV ELASTICSEARCH_SSL_CERTIFICATEAUTHORITIES=/usr/share/kibana/config/certs/ca/ca.crt
#
#ENV ELASTICSEARCH_USERNAME=kibana_system
#ENV ELASTICSEARCH_PASSWORD=changeme

COPY ./conf/kibana.yml /usr/share/kibana/config/kibana.yml