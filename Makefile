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

.PHONY: test