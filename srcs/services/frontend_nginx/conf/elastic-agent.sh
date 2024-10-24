#!/bin/bash

umask 0007;
set -eo pipefail;

nginx -g "daemon off;" &
elastic-agent container "$@";
