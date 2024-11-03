#!/bin/bash

/bin/elasticsearch_exporter --es.uri=https://"${ELASTIC_USERNAME}":"${ELASTIC_PASSWORD}"@backend-elastic:9200 --es.ssl-skip-verify