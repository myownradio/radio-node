// @flow

import getFetch from '../fetch';

import type { FetchResult } from '../fetch';

export default (backend: string) => {
  const fetch = getFetch(backend);

  return (channelId: string): Promise<FetchResult> => fetch(channelId);
};
