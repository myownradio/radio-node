DOCKER_ENV_IMAGE := "peacefulbit/radio-node-env"
DOCKER_APP_IMAGE := "peacefulbit/radio-node-app"

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

start:
	yarn run babel-node src/bin/radio-node.js

start-watch:
	yarn run babel-watch src/bin/radio-node.js

docker-build-env:
	docker build -t $(DOCKER_ENV_IMAGE) docker-env

docker-build-app: build
	docker build -t $(DOCKER_APP_IMAGE) .

.PHONY: test
