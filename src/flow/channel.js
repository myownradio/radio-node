// @flow

import streamer from '../stream';

const channels = {};

const startChannel = (channelId) => {
  channels[channelId] = null;
};

const isChannelStarted = channelId => channelId in channels;

const stopChannel = (channelId: string) => {
  channels[channelId].stop();
  delete channels[channelId];
};

const getListenersCount = (channelId: string) => channels[channelId].getListenersCount();

const isNoListeners = (channelId: string) => getListenersCount(channelId) === 0;

const stopIfNoListeners = (channelId: string) => {
  if (isNoListeners(channelId)) {
    stopChannel(channelId);
  }
};

export const addListener = (client: express$Response, channelId: string) => {
  if (!isChannelStarted(channelId)) {
    channels[channelId] = startChannel(channelId);
  }

  client.once('close', () => {
    channels[channelId].removeClient(client);
    stopIfNoListeners(channelId);
  });

  channels[channelId].addClient(client);
};

export default { addListener };
