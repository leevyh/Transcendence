#!/bin/bash

curl --cacert /usr/share/logstash/config/certs/ca/ca.crt -u "$ELASTIC_USERNAME":"$ELASTIC_PASSWORD" -X PUT "https://backend-elastic:9200/_ilm/policy/default-policy?pretty" -H 'Content-Type: application/json' -d'
{
  "policy": {
    "_meta": {
      "description": "Default cluster-elk ILM"                            
    },
    "phases": {
      "delete": {
        "min_age": "30d",
        "actions": {
          "delete": {}
        }             
      }
    }
  }
}
'

curl --cacert /usr/share/logstash/config/certs/ca/ca.crt -u "$ELASTIC_USERNAME":"$ELASTIC_PASSWORD" -X PUT "https://backend-elastic:9200/django*/_settings?pretty" -H 'Content-Type: application/json' -d'
{
  "index": {
    "lifecycle": {
      "name": "default-policy"
    }
  }
}
'

curl --cacert /usr/share/logstash/config/certs/ca/ca.crt -u "$ELASTIC_USERNAME":"$ELASTIC_PASSWORD" -X PUT "https://backend-elastic:9200/postgresql*/_settings?pretty" -H 'Content-Type: application/json' -d'
{
  "index": {
    "lifecycle": {
      "name": "default-policy"
    }
  }
}
'

curl --cacert /usr/share/logstash/config/certs/ca/ca.crt -u "$ELASTIC_USERNAME":"$ELASTIC_PASSWORD" -X PUT "https://backend-elastic:9200/.ds-logs-nginx*/_settings?pretty" -H 'Content-Type: application/json' -d'
{
  "index": {
    "lifecycle": {
      "name": "default-policy"
    }
  }
}
'