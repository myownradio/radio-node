// @flow

import { Writable } from 'stream';
import async from 'async';

export default () => {
  let clients: Array<stream$Writable> = [];

  const streamInput = new Writable({
    write(chunk, encoding, callback) {
      async.each(clients, (l, next) => l.write(chunk, encoding, next), callback);
    },
  });

  const clientsCount = () => clients.length;

  const removeClient = (client: stream$Writable): void => {
    clients = clients.filter(c => c !== client);
  };

  const bindRemoveCases = (client: stream$Writable): void => {
    client.on('close', () => removeClient(client));
    client.on('error', () => removeClient(client));
  };

  const addClient = (client: stream$Writable): void => {
    bindRemoveCases(client);
    clients = [...clients, client];
  };

  return { streamInput, addClient, removeClient, clientsCount };
};
