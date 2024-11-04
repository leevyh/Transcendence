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
COMPOSL	= ./docker-compose-lite.yml

DATA	= ./srcs/data
ENVV	= ./env

DSTP	= ./srcs/setup/dir_setup.sh
DCLP	= ./srcs/setup/dir_cleanup.sh
DCPF	= ./srcs/setup/dir_cleanup_force.sh

ECHK	= ./srcs/setup/env_check.sh

all:
	@echo "Make sure that any services or volumes created by master version are removed before running lite mode"
	@echo "Also, you need all environment files and directories required by the master version"
	@echo "Beware you may experience longer docker build and services starting time!"
	@echo -n "Continue? [y/N] " && read ans && [ $${ans:-N} = y ]
	@${ECHK} ${ENVV}
	@${DSTP} ${DATA}
	@docker compose -f ${COMPOSL} up -d --build

down:
	@docker compose -f ${COMPOSL} down  --rmi all
	@echo "Note that containers are being removed with down --rmi all to ensure non-conflicting services"

a-full:
	@${ECHK} ${ENVV}
	@${DSTP} ${DATA}
	docker compose -f ${COMPOSE} up -d --build

d-full:
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

re: d-lite a-lite

r-full: down all

.PHONY: all down clean force logs status prune re
.SILENT: all down clean force logs status prune re