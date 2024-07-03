FROM postgres:latest


RUN apt update -y && apt upgrade -y

COPY ./tools/script.sh /tmp/script.sh
RUN chmod +x /tmp/script.sh

USER postgres

RUN service postgresql start

EXPOSE 5432

#RUN CONTAINER POSTGRESQL

CMD ["sh", "/tmp/script.sh"]