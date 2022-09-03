NPM := $(shell which npm)
DOCKER_FOLDER=./.docker

copy-env:
	cp ./.env.example ./.env

install:
	${NPM} ci

docker-up:
	cd ${DOCKER_FOLDER} && docker-compose up -d

docker-down:
	cd ${DOCKER_FOLDER} && docker-compose down

migrate:
	${NPM} run migrate

rollback:
	${NPM} run migrate:undo

start-dev:
	${NPM} run start:dev

start:
	${NPM} run start

pre-install: copy-env install
