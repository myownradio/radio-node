FROM peacefulbit/radio-node-env

WORKDIR /app

COPY dist/ ./

CMD ['node', 'bin/radio-node.js']
