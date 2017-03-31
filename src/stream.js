// @flow

import { PassThrough } from 'stream';

import { pipeWithError, unpipeOnCloseOrError } from './utils/stream-utils';
import { createEncoder } from './core/encoder';
import Stream from './core/stream';

export default class AdhocStream {
  stream: Stream;
  broadcast: PassThrough;
  input: PassThrough;

  constructor(backend: string) {
    this.stream = new Stream(backend, 'martas-vk');
    this.broadcast = new PassThrough();
    this.stream.pipe(createEncoder()).pipe(this.broadcast);
  }

  subscribe(output: express$Response) {
    pipeWithError(this.broadcast, output);
    unpipeOnCloseOrError(this.broadcast, output);
  }
}
