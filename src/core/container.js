// @flow

import startStreamer from './streamer';

import type { Backend } from '../fetcher';
import type { Streamer } from './streamer';

type Container = { [key: string]: Streamer };


export default (backend: Backend) => {
  const streamers: Container = {};

  const startStreaming = (channelId: string): void => {
    const streamer = startStreamer(channelId, backend);
    streamers[channelId] = streamer;
  };

  const stopStreaming = (channelId: string): void => {
    streamers.get(channelId).stop();
    delete streamers.delete(channelId);
  };

  const isStreaming = (channelId: string): boolean => channelId in streamers;

  return { startStreaming, stopStreaming, isStreaming };
};
