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

DATA	= ./srcs/data
ENVV	= ./env

DSTP	= ./srcs/setup/dir_setup.sh
DCLP	= ./srcs/setup/dir_cleanup.sh
DCPF	= ./srcs/setup/dir_cleanup_force.sh

ECHK	= ./srcs/setup/env_check.sh

all:
	@${ECHK} ${ENVV}
	@${DSTP} ${DATA}
	docker compose -f ${COMPOSE} up -d --build

down:
	docker compose -f ${COMPOSE} down

clean:
	docker compose -f ${COMPOSE} down --rmi all
	@${DCPF} ${DATA}

logs:
	docker compose logs -f

status:
	docker compose ps

prune:
	docker system prune -af

re: down all

.PHONY: all down clean force logs status prune re
.SILENT: all down clean force logs status prune re