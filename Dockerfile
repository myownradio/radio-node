FROM peacefulbit/radio-node-env

WORKDIR /app

COPY . .

RUN make install build

CMD [ "yarn", "start" ]

EXPOSE 6767
