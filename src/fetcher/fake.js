// @flow

import type { FetchResult } from './';

const fetch = (channelId: string): Promise<FetchResult> => new Promise((resolve) => {
  resolve({
    url: `${__dirname}/../../data/demo.mp3`,
    title: `Sample Audio on channel ${channelId}`,
    offset: 0,
  });
});

export default fetch;
