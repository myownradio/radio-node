// @flow

import EventEmitter from 'events';

import { module } from '../utils/log-utils';
import { createEncoder } from './encoder';
import Stream from './stream';
import Broadcast from './broadcast';

export default class Player extends EventEmitter {
  channelId: string;
  title: string;

  stream: Stream;
  broadcast: Broadcast;
  log = module(this);

  constructor(backend: string, channelId: string) {
    super();

    this.log('info', 'Initialized');

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

  countClients(): number {
    return this.broadcast.count();
  }

  stop() {
    this.log('info', 'Stop');
    this.stream.stop();
    this.broadcast.clear();
  }

  _bindEventHandlers() {
    this.stream.on('error', (error) => {
      this.log('error', error);
    });
    this.stream.on('title', (title) => {
      this.title = title;
    });

    this.broadcast.on('gone', () => {
      this.log('info', 'Client is gone');
      this.emit('gone');
      if (this.broadcast.count() === 0) {
        this.log('info', 'Player is idle');
        this.emit('idle');
      }
    });
    this.broadcast.on('new', () => {
      this.log('info', 'New client');
      this.emit('new');
    });
  }

  _connectStreamToBroadcast() {
    this.log('info', 'Init encoder chain');
    this.stream.pipe(createEncoder()).pipe(this.broadcast);
  }

  toString(): string {
    return `player(channelId=${this.channelId}, title=${this.title}, clients=${this.countClients()})`;
  }
}
