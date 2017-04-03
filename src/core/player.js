// @flow

import winston from 'winston';
import EventEmitter from 'events';

import { createEncoder } from './encoder';
import Stream from './stream';
import Broadcast from './broadcast';

export default class Player extends EventEmitter {
  channelId: string;

  stream: Stream;
  broadcast: Broadcast;

  constructor(backend: string, channelId: string) {
    super();

    winston.log('info', 'Initializing player.', { backend, channelId });

    this.channelId = channelId;
    this.stream = new Stream(backend, channelId);

    this.broadcast = new Broadcast();

    this._bindEventHandlers();
    this._connectStreamToBroadcast();
  }

  addClient(output: express$Response) {
    output.header('Content-Type', 'audio/mpeg');
    this.broadcast.addClient(output);
  }

  hasClients(): boolean {
    return this.broadcast.clients.length > 0;
  }

  stop() {
    this.stream.stop();
    this.broadcast.clear();
  }

  _bindEventHandlers() {
    this.broadcast.on('gone', () => {
      this.emit('gone');
      if (this.broadcast.count() === 0) {
        this.emit('idle');
      }
    });
    this.broadcast.on('new', () => this.emit('new'));
  }

  _connectStreamToBroadcast() {
    winston.log('info', 'Initializing encoder.');
    this.stream.pipe(createEncoder()).pipe(this.broadcast);
  }
}
