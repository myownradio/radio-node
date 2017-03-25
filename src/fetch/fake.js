// @flow

import type { FetchResult } from './';

const startedAt = 1490308681000;

const audioDuration = 24240;

const fetch = (channelId: string): Promise<FetchResult> => new Promise((resolve) => {
  resolve({
    url: `${__dirname}/../../data/demo.mp3`,
    title: `Sample Audio on channel ${channelId}`,
    offset: (Date.now() - startedAt) % audioDuration,
  });
});

export default fetch;
