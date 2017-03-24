// @flow

import { Streamer } from './streamer';

export default class Container {
  backend: string;
  streamers: { [key: string]: Streamer } = {};

  constructor(backend: string) {
    this.backend = backend;
  }

  start(channelId: string) {
    this.streamers[channelId] = new Streamer(channelId, this.backend);
  }

  stop(channelId: string) {
    this.streamers[channelId].stop();
    delete this.streamers[channelId];
  }

  isRunning(channelId: string) {
    return channelId in this.streamers;
  }
}
