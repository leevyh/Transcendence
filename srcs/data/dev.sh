#!/bin/bash

rm -rf ./certs ./ea/proxy-nginx ./ea ./elastic ./kibana ./fleet ./logs || return 1

mkdir -p ./certs ./ea ./ea/proxy-nginx ./elastic ./kibana ./fleet ./logs || return 1