// @flow

import Streamer from './streamer';

export default (backend: string) => {
  const streamers: { [key: string]: Streamer } = {};

  return {
    start(channelId: string) {
      streamers[channelId] = new Streamer(channelId, backend);
    },

    stop(channelId: string) {
      this.streamers[channelId].stop();
      delete streamers[channelId];
    },

    isRunning(channelId: string) {
      return channelId in streamers;
    },
  };
};
