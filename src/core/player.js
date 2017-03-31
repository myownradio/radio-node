// @flow

import { PassThrough } from 'stream';
import EventEmitter from 'events';

import { pipeWithError, unpipeOnCloseOrError } from '../utils/stream-utils';
import { createEncoder } from './encoder';
import Stream from './stream';

export const PLAYER_STOP_DELAY = 30000;

export default class Player extends EventEmitter {
  stream: Stream;
  broadcast: PassThrough;
  clientsCount: number = 0;

  stopTimer: number | null;

  constructor(backend: string, channelId: string) {
    super();
    this.stream = new Stream(backend, channelId);
    this.broadcast = new PassThrough();

    this._bindEventHandlers();
    this._encodeStreamToBroadcast();
  }

  addClient(output: express$Response) {
    this._cancelPlayerStopTimeout();
    this._bindClientsCounter(output);

    pipeWithError(this.broadcast, output);
    unpipeOnCloseOrError(this.broadcast, output);
  }

  hasClients(): boolean {
    return this.clientsCount > 0;
  }

  _encodeStreamToBroadcast() {
    this.stream.pipe(createEncoder()).pipe(this.broadcast);
  }

  _bindEventHandlers() {
    this.stream.on('stop', () => {
      this._removeClients();
      this.emit('stop');
    });
  }

  _bindClientsCounter(output: express$Response) {
    output.on('pipe', () => {
      this.clientsCount += 1;
    });
    output.on('unpipe', () => {
      this.clientsCount -= 1;
      this._stopIfNoClients();
    });
  }

  _stopIfNoClients() {
    if (!this.hasClients()) {
      this._schedulePlayerStopTimeout();
    }
  }

  _schedulePlayerStopTimeout() {
    this.stopTimer = setTimeout(() => this.stream.stop(), PLAYER_STOP_DELAY);
  }

  _cancelPlayerStopTimeout() {
    if (this.stopTimer !== null) {
      clearTimeout(this.stopTimer);
      this.stopTimer = null;
    }
  }

  _removeClients() {
    this.broadcast.unpipe();
  }
}
