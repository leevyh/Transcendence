if [ "x$1" == "x" ]; then
  echo "./esa.sh <ENROLLMENT_TOKEN>";
  exit 1;
fi;

if [ ! -f /usr/bin/docker ]; then
  apt install ca-certificates curl;
  install -m 0755 -d /etc/apt/keyrings;
  curl -fsSL https://download.docker.com/linux/debian/gpg -o /etc/apt/keyrings/docker.asc;
  chmod a+r /etc/apt/keyrings/docker.asc;

  echo \
    "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/debian \
    $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
    tee /etc/apt/sources.list.d/docker.list > /dev/null;
  apt update;
fi;

if [ ! -f elastic-agent-8.14.2-linux-x86_64 ]; then
  curl -L -O https://artifacts.elastic.co/downloads/beats/elastic-agent/elastic-agent-8.14.2-linux-x86_64.tar.gz
  tar xzvf elastic-agent-8.14.2-linux-x86_64.tar.gz
  cd elastic-agent-8.14.2-linux-x86_64
  ./elastic-agent install -f --url="https://backend-fleet:9243" --enrollment-token="$1"
  cd ..
fi;

echo "Starting Elastic Agent";
./elastic-agent-8.14.2-linux-x86_64/elastic-agent run;

