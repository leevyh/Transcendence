FROM postgres:15.8-alpine

RUN mkdir -p /var/log/postgresql && touch /var/log/postgresql/postgresql.log && chown -R postgres:postgres /var/log/postgresql

CMD ["postgres", "-c", "logging_collector=on", "-c", "log_directory=/var/log/postgresql", "-c", "log_filename=postgresql.log", "-c", "log_statement=all"]