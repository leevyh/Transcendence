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

a-lite:
	@echo "\033[0;33m" "Make sure that any services or volumes created by master version are removed before running lite mode \033[0m"
	@echo "\033[0;33m" "Also, you need all environment files and directories required by the master version \033[0m \n"
	@echo "\033[0;34m" "Beware you may experience longer docker build and services starting time! \033[0m \n"
	@echo -n "Continue? [y/N] " && read ans && [ $${ans:-N} = y ]
	@${ECHK} ${ENVV}
	@${DSTP} ${DATA}
	@docker compose -f ${COMPOSL} up -d --build

d-lite:
	@docker compose -f ${COMPOSL} down  --rmi all
	@echo "\033[0;34m Note that containers are being removed with \033[1;36mdown --rmi all\033[0;34m to ensure non-conflicting services \033[0m"

r-lite: d-lite a-lite

.PHONY: all down clean force logs status prune re
.SILENT: all down clean force logs status prune re