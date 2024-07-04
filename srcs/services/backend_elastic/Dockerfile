FROM elasticsearch:8.14.1

ENV bootstrap.memory_lock=false
ENV cluster.name=transcendence-elk-cluster
ENV discovery.type=single-node
ENV node.name=backend_elastic
ENV xpack.monitoring.collection.enabled=true
ENV xpack.security.enabled=true
ENV xpack.security.http.ssl.enabled=true
ENV xpack.security.http.ssl.key=certs/backend_elastic/backend_elastic.key
ENV xpack.security.http.ssl.certificate=certs/backend_elastic/backend_elastic.crt
ENV xpack.security.http.ssl.certificate_authorities=certs/ca/ca.crt
ENV xpack.security.transport.ssl.enabled=true
ENV xpack.security.transport.ssl.key=certs/backend_elastic/backend_elastic.key
ENV xpack.security.transport.ssl.certificate=certs/backend_elastic/backend_elastic.crt
ENV xpack.security.transport.ssl.certificate_authorities=certs/ca/ca.crt
ENV xpack.security.transport.ssl.verification_mode=certificate
ENV xpack.license.self_generated.type=basic



