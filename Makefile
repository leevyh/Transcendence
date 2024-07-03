NAME = Transcendence


all:
	docker compose up --build -d
#create volume maybe needed

down:
	docker compose down
	docker system prune -af

logs:
	docker compose logs -f

# postgres:
# 	docker build -t postgres ./srcs/services/postgresql/
# # 	docker run -e POSTGRES_PASSWORD=1234 -e POSTGRES_DB=transcendence -p 5432:5432 --name postgres -it postgres

re: down all