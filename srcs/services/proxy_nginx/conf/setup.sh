#!/bin/sh

if [ "x$1" = "x" ]; then
  echo "./setup.sh <ENROLLMENT_TOKEN>";
  exit 1;
fi;

if [ ! -f elastic-agent-8.14.1-linux-x86_64.done ]; then
  echo "Downloading Elastic Agent";
  curl -L -O https://artifacts.elastic.co/downloads/beats/elastic-agent/elastic-agent-8.14.1-linux-x86_64.tar.gz;
  echo "Extracting Elastic Agent";
  tar xzf elastic-agent-8.14.1-linux-x86_64.tar.gz && rm elastic-agent-8.14.1-linux-x86_64.tar.gz;
  echo "Installing Elastic Agent"
  cd elastic-agent-8.14.1-linux-x86_64;
  ./elastic-agent install --force --certificate-authorities=/usr/share/elasticsearch/config/certs/ca/ca.crt --fleet-server-cert=/usr/share/elasticsearch/config/certs/backend-fleet/backend-fleet.crt --fleet-server-cert-key=/usr/share/elasticsearch/config/certs/backend-fleet/backend-fleet.key --url=https://backend-fleet:8220 --enrollment-token="$1";
  touch /elastic-agent-8.14.1-linux-x86_64.done;
else
  echo "Running Elastic Agent";
  cd elastic-agent-8.14.1-linux-x86_64;
  ./elastic-agent run;
fi;

nginx -g "daemon off;"