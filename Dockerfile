FROM peacefulbit/radio-node-env

WORKDIR /app

COPY . .

EXPOSE 6767
CMD [ "yarn", "start" ]
