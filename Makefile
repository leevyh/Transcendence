NAME = Transcendence

all:
	docker compose up --build -d
#create volume maybe needed

down:
	docker compose down
	docker system prune -af

logs:
	docker compose logs -f

status:
	docker compose ps

re: down
	$(MAKE) all