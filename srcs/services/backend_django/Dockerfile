FROM python:3.12.4

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /home/app/

RUN apt update -y && apt upgrade -y
RUN apt install -y python3 python3-pip

COPY ./tools/requirements.txt /home/app/requirements.txt

RUN pip3 install --upgrade pip
RUN pip3 install --no-cache-dir -r /home/app/requirements.txt

COPY . .

CMD ["gunicorn", "backend.wsgi:application", "--bind", "0.0.0.0:8000"]