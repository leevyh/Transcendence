#!/bin/sh

if [ "x$1" = "x" ]; then
  echo "./setup.sh <ELASTIC_PASSWORD> <KIBANA_PASSWORD>";
  exit 1;
elif [ "x$2" = "x" ]; then
  echo "./setup.sh <ELASTIC_PASSWORD> <KIBANA_PASSWORD>";
  exit 1;
fi;

if [ ! -f config/certs/ca.zip ]; then
  echo "Creating CA";
  bin/elasticsearch-certutil ca --silent --pem -out config/certs/ca.zip;
  unzip config/certs/ca.zip -d config/certs;
fi;

if [ ! -f config/certs/certs.zip ]; then
  echo "Creating certs";
  echo -ne \
  "instances:\n"\
  "  - name: backend-elastic\n"\
  "    dns:\n"\
  "      - backend-elastic\n"\
  "    ip:\n"\
  "      - 127.0.0.1\n"\
  "  - name: backend-kibana\n"\
  "    dns:\n"\
  "      - backend-kibana\n"\
  "    ip:\n"\
  "      - 127.0.0.1\n"\
  "  - name: backend-fleet\n"\
  "    dns:\n"\
  "      - backend-fleet\n"\
  "    ip:\n"\
  "      - 127.0.0.1\n"\
  "  - name: backend-logstash\n"\
  "    dns:\n"\
  "      - backend-logstash\n"\
  "    ip:\n"\
  "      - 127.0.0.1\n"\
  "  - name: proxy-nginx\n"\
  "    dns:\n"\
  "      - proxy-nginx\n"\
  "    ip:\n"\
  "      - 127.0.0.1\n"\
  > config/certs/instances.yml;
  bin/elasticsearch-certutil cert --silent --pem -out config/certs/certs.zip --in config/certs/instances.yml --ca-cert config/certs/ca/ca.crt --ca-key config/certs/ca/ca.key;
  unzip config/certs/certs.zip -d config/certs;
fi;

echo "Setting file permissions"
chown -R 1000:0 /usr/share/elasticsearch;
chown -R 1000:0 /usr/share/kibana;
chown -R 0:0 /usr/share/elasticsearch/config/certs;
find . -type d -exec chmod 750 \{\} \;;
find . -type f -exec chmod 640 \{\} \;;
chmod +x setup.sh;

echo "Waiting for Elasticsearch availability";
until curl -s --cacert config/certs/ca/ca.crt https://backend-elastic:9200 | grep -q "missing authentication credentials"; do
  sleep 1;
done;

echo "Setting kibana password";
until curl -s -X POST --cacert config/certs/ca/ca.crt -u "elastic:$1" -H "Content-Type: application/json" https://backend-elastic:9200/_security/user/kibana_system/_password -d "{\"password\":\"$2\"}" | grep -q "^{}"; do
  sleep 1;
done;

echo "All done!";