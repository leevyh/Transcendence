FROM postgres:latest


RUN apt update -y && apt upgrade -y

#COPY ./tools/script.sh /docker-entrypoint-initdb.d/script.sh
#
#RUN chmod +x /docker-entrypoint-initdb.d/script.sh

#USER postgres

#RUN service postgresql start

EXPOSE 5432

ENTRYPOINT ["docker-entrypoint.sh"]

#RUN CONTAINER POSTGRESQL

#CMD ["sh", "/tmp/script.sh"]
CMD ["postgres"]