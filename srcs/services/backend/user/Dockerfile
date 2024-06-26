FROM python:latest

# Install Python and Django + PostgresSQL
RUN apt update && apt install python3 python3-pip -y
# RUN apt install postgresql -y


# Install dependencies
COPY /conf/requirements.txt .
RUN pip install --no-cache-dir -r /requirements.txt

WORKDIR /app
COPY . /app/

ENTRYPOINT ["python", "pong/manage.py"]
# CMD ["runserver", "0.0.0.0:8002"]
