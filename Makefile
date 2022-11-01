NPM := $(shell which npm)
DOCKER_FOLDER=./.docker

copy-env:
	cp ./.env.example ./.env

install:
	${NPM} ci

docker-build:
	cd ${DOCKER_FOLDER} && sudo docker-compose build

docker-up:
	cd ${DOCKER_FOLDER} && sudo docker-compose up -d --build

docker-down:
	cd ${DOCKER_FOLDER} && sudo docker-compose down

start:
	${NPM} run start