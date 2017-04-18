// @flow

import { Client } from 'node-rest-client';

import type { FetchResult } from './';

const endpoint: string = 'http://myownradio.biz/api/v0/stream/${channelId}/now';

const fetch = (channelId: string): Promise<FetchResult> => new Promise((resolve, reject) => {
  const client = new Client();
  const req = client.get(endpoint, { path: { channelId } }, (data, response) => {
    if (response.statusCode === 200) {
      resolve(data.data);
    } else {
      reject('Error response.');
    }
  });
  req.on('error', err => reject(err));
});

export default fetch;
