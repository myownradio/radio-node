// @flow

import { log } from 'winston';

import { Writable } from 'stream';

export default class Broadcast extends Writable {
  clients = [];

  _write(chunk: Buffer | string, enc: string, callback: () => void): boolean {
    this.clients.forEach(c => c.write(chunk, enc));
    callback();
    return true;
  }

  addClient(client: Writable) {
    log('info', 'Added new client.');
    client.on('close', () => this.removeClient(client));
    client.on('error', () => this.removeClient(client));
    this.clients.append(client);
    this.emit('new', client);
  }

  clear() {
    this.clients.forEach(c => c.end());
    this.clients = [];
  }

  removeClient(client: Writable) {
    const clientIndex = this.clients.indexOf(client);
    if (clientIndex > -1) {
      log('info', 'Client gone.');
      this.clients.splice(clientIndex, 1);
      this.emit('gone', client);
    }
  }

  count(): number {
    return this.clients.length;
  }
}
