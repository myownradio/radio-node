DOCKER_ENV_IMAGE := "peacefulbit/radio-node-env"
DOCKER_APP_IMAGE := "peacefulbit/radio-node-app"
DOCKER_APP_CONTAINER := "radio-node"

install:
	yarn

build: clean
	yarn run build

test:
	yarn test

lint:
	yarn run tslint -- src __test__

clean:
	rm -rf dist

docker-build-env:
	docker build -t $(DOCKER_ENV_IMAGE) docker-env

docker-build-app: build
	docker build -t $(DOCKER_APP_IMAGE) .

docker-start:
	docker run -p 6767:6767 --rm --name $(DOCKER_APP_CONTAINER) $(DOCKER_APP_IMAGE)

.PHONY: test
