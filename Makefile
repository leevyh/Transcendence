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

down:
	docker compose -f ${COMPOSE} down --rmi all

logs:
	docker compose logs -f

status:
	docker compose ps

prune:
	docker system prune -af

re: down
	$(MAKE) all

.PHONY: all debug clean folder prune re
.SILENT: all debug clean folder prune re
