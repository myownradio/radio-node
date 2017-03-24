// @flow

import { Writable } from 'stream';
import async from 'async';

export default class MultiWritable extends Writable {
  clients: Array<stream$Writable> = [];

  clientsCount(): number {
    return this.clients.length;
  }

  write(chunk: string | Buffer, encoding: any, callback: any): boolean {
    async.each(this.clients, (l, next) => l.write(chunk, encoding, next), callback);
    return true;
  }

  removeClient(client: stream$Writable): void {
    this.clients = this.clients.filter(c => c !== client);
  }

  addClient(client: stream$Writable): void {
    this._bindRemoveCases(client);
    this.clients = [...this.clients, client];
  }

  _bindRemoveCases = (client: stream$Writable): void => {
    client.on('close', () => this.removeClient(client));
    client.on('error', () => this.removeClient(client));
  }
}
