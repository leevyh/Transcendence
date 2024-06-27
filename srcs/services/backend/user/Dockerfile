FROM debian:latest

# Install Python and Django + PostgresSQL
RUN apt update -y && apt install python3 -y
# RUN apt install python3-pip -y
RUN apt install -y pip
RUN apt install postgresql -y

# Set environment variables
# ENV USER_DB_NAME=dbuser
# ENV USER_DB_PASS=dbpass
# ENV USER_DB_HOST=db

# Database configuration
# RUN service postgresql start && su - postgres -c "psql -c \"CREATE USER $USER_DB_NAME WITH PASSWORD '$USER_DB_PASS';\"" && su - postgres -c "psql -c \"ALTER ROLE $USER_DB_NAME SET client_encoding TO 'utf8';\"" && su - postgres -c "psql -c \"ALTER ROLE $USER_DB_NAME SET default_transaction_isolation TO 'read committed';\"" && su - postgres -c "psql -c \"ALTER ROLE $USER_DB_NAME SET timezone TO 'UTC';\"" && su - postgres -c "psql -c \"CREATE DATABASE $USER_DB_NAME OWNER $USER_DB_NAME;\""

# Create a directory for the app
# RUN mkdir /app


RUN python3 -m venv env
ENV PATH="/opt/venv/bin:$PATH"

# Install dependencies
COPY /conf/requirements.txt .
RUN pip install --no-cache-dir -r /requirements.txt

# COPY . /app/
WORKDIR /app

# Expose the port 8080
EXPOSE 8080

# Run the application
# CMD ["runserver", "0.0.0.0:8080"]
CMD python3 manage.py runserver 0.0.0.0:8080 
