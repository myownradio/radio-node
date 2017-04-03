FROM peacefulbit/radio-node-env

WORKDIR /app

COPY package.json yarn.lock .env ./
RUN yarn install

COPY dist/ dist/

EXPOSE 6767
CMD [ "yarn", "start" ]
