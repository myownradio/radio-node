install: install-deps

run:
	npm run babel-node -- 'src/bin/hexlet.js' 10

install-deps:
	yarn

build: clean
	npm run build

test:
	npm test

check-types:
	npm run flow

lint:
	npm run eslint -- src test

publish:
	npm publish

clean:
	rm -rf dist

.PHONY: test