// @flow

import { PassThrough } from 'stream';
import { EventEmitter } from 'events';

import { pipeWithError, unpipeOnCloseOrError } from './utils/stream-utils';
import { createEncoder } from './core/encoder';
import Stream from './core/stream';

export default class AdhocStream extends EventEmitter {
  stream: Stream;
  broadcast: PassThrough;
  listenersCount: number = 0;

  constructor(backend: string) {
    this.stream = new Stream(backend, 'martas-vk');
    this.broadcast = new PassThrough();
    this.stream.pipe(createEncoder()).pipe(this.broadcast);
  }

  subscribe(output: express$Response) {
    this._bindListenersCounter(output);

    pipeWithError(this.broadcast, output);
    unpipeOnCloseOrError(this.broadcast, output);
  }

  _bindListenersCounter(output: express$Response) {
    output.on('pipe', () => { this.listenersCount += 1; });
    output.on('unpipe', () => {
      this.listenersCount -= 1;
      this._stopIfNoListeners();
    });
  }

  _stopIfNoListeners() {
    if (!this.listenersCount) {
      this.stream.stop();
    }
  }
}
