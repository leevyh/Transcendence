# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Makefile                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: acrespy <acrespy@student.42.fr>            +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2023/05/15 14:54:39 by acrespy           #+#    #+#              #
#    Updated: 2023/05/16 15:01:53 by acrespy          ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

NAME	= ft_transcendence
COMPOSE	= ./docker-compose.yml

all:
	docker compose -f ${COMPOSE} up -d --build

debug:
	docker compose -f ${COMPOSE} up --build

build:
	docker compose -f ${COMPOSE} build

start:
	docker compose -f ${COMPOSE} up -d

stop:
	docker compose -f ${COMPOSE} stop

restart:
	docker compose -f ${COMPOSE} restart

clean:
	docker compose -f ${COMPOSE} down --rmi all

prune:
	docker system prune -af

re: clean all

.PHONY: all debug build start stop restart clean prune re
.SILENT: all debug build start stop restart clean prune re