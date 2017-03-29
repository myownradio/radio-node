// @flow

import { Writable } from 'stream';
import async from 'async';

export default class MultiWritable extends Writable {
  clients: Array<stream$Writable> = [];

  clientsCount(): number {
    return this.clients.length;
  }

  _write(chunk: Buffer | string, enc: string, callback: () => void) {
    async.each(this.clients, (l, next) =>
      l.write(chunk, enc, next), callback);
    return true;
  }

  _closeClients() {
    this.clients.forEach(c => c.end());
    this.clients = [];
  }

  close() {
    this._closeClients();
    this.end();
  }

  removeClient(client: stream$Writable): void {
    this.clients = this.clients.filter(c => c !== client);
  }

  addClient(client: stream$Writable): void {
    this._bindRemoveClient(client);
    this.clients = [...this.clients, client];
  }

  _bindRemoveClient(client: stream$Writable): void {
    client.on('close', () => this.removeClient(client));
    client.on('error', () => this.removeClient(client));
  }
}
