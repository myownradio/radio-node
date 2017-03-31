// @flow

import winston from 'winston';
import { PassThrough } from 'stream';
import EventEmitter from 'events';

import { pipeWithError, unpipeOnCloseOrError } from '../utils/stream-utils';
import { createEncoder } from './encoder';
import Stream from './stream';

export const PLAYER_STOP_DELAY = 10000;

export default class Player extends EventEmitter {
  channelId: string;

  stream: Stream;
  broadcast: PassThrough;
  clientsCount: number = 0;

  stopTimer: number | null;

  constructor(backend: string, channelId: string) {
    super();

    winston.log('info', 'Initializing player.', { backend, channelId });

    this.channelId = channelId;
    this.stream = new Stream(backend, channelId);

    this.broadcast = new PassThrough();

    this._bindEventHandlers();
    this._encodeStreamToBroadcast();
  }

  addClient(output: express$Response) {
    winston.log('info', 'Adding client to player.', { channelId: this.channelId });

    this._cancelPlayerStopTimeout();
    this._bindClientsCounter(output);

    pipeWithError(this.broadcast, output);
    unpipeOnCloseOrError(this.broadcast, output);
  }

  hasClients(): boolean {
    return this.clientsCount > 0;
  }

  _encodeStreamToBroadcast() {
    winston.log('info', 'Initializing encoder.');
    this.stream.pipe(createEncoder()).pipe(this.broadcast);
  }

  _bindEventHandlers() {
    this.stream.on('end', () => {
      winston.log('info', 'Stream is stopped. Removing clients and passing event to player.');
      this._removeClients();
    });
  }

  _bindClientsCounter(output: express$Response) {
    output.on('pipe', () => {
      this.clientsCount += 1;
      winston.log('info', 'Increasing clients count.', {
        channelId: this.channelId,
        clientsCount: this.clientsCount,
      });
    });
    output.on('unpipe', () => {
      this.clientsCount -= 1;
      winston.log('info', 'Decreasing clients count.', {
        channelId: this.channelId,
        clientsCount: this.clientsCount,
      });
      this._stopIfNoClients();
    });
  }

  _stopIfNoClients() {
    if (!this.hasClients()) {
      this._schedulePlayerStopTimeout();
    }
  }

  _schedulePlayerStopTimeout() {
    winston.log('info', 'Scheduling player stop.', {
      channelId: this.channelId,
    });
    this.stopTimer = setTimeout(() => this.stream.stop(), PLAYER_STOP_DELAY);
  }

  _cancelPlayerStopTimeout() {
    if (this._isPlayerStopScheduled()) {
      winston.log('info', 'Canceling player stop.', {
        channelId: this.channelId,
      });
      clearTimeout(this.stopTimer);
      this.stopTimer = null;
    }
  }

  _isPlayerStopScheduled() {
    return this.stopTimer !== null;
  }

  _removeClients() {
    winston.log('info', 'Removing all clients.', {
      channelId: this.channelId,
    });
    this.broadcast.unpipe();
  }
}
