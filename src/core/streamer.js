// @flow

import MultiWritable from './multiwritable';
import Encoder from './encoder';

export default class Streamer {
  channelId: string;
  backend: string;

  multiWritable: MultiWritable;
  encoder: Encoder;

  constructor(channelId: string, backend: string) {
    this.channelId = channelId;
    this.backend = backend;

    this.multiWritable = new MultiWritable();
    this.encoder = new Encoder(this.multiWritable);
  }

  stop() {
    this.multiWritable.close();
    this.encoder.close();
  }
}
