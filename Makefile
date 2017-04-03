DOCKER_ENV_IMAGE := "peacefulbit/radio-node-env"
DOCKER_APP_IMAGE := "peacefulbit/radio-node-app"
DOCKER_APP_CONTAINER := "radio-node"

install: install-deps install-flow-typed

run:
	npm run babel-node -- 'src/bin/hexlet.js' 10

install-deps:
	yarn

install-flow-typed:
	yarn run flow-typed install

build: clean
	yarn run build

test:
	yarn test

typecheck:
	yarn run flow

lint:
	yarn run eslint -- src __test__

publish:
	yarn publish

clean:
	rm -rf dist

dev:
	yarn run babel-node src/bin/radio-node.js

dev-watch:
	yarn run babel-watch src/bin/radio-node.js

docker-build-env:
	docker build -t $(DOCKER_ENV_IMAGE) docker-env

docker-build-app: build
	docker build -t $(DOCKER_APP_IMAGE) .

docker-start:
	docker run -p 6767:6767 --rm --name $(DOCKER_APP_CONTAINER) $(DOCKER_APP_IMAGE)

.PHONY: test
