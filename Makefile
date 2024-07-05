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

clean:
	docker compose -f ${COMPOSE} down --rmi all

folder:
	@mkdir -p ./srcs/data/certs
	@mkdir -p ./srcs/data/elastic
	@mkdir -p ./srcs/data/kibana
	@mkdir -p ./srcs/data/logs

prune:
	docker system prune -af

re: clean all

.PHONY: all debug clean folder prune re
.SILENT: all debug clean folder prune re