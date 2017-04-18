// @flow

import mor from './mor';
import fake from './fake';

export type FetchResult = {
  offset: number,
  title: string,
  url: string,
};

export type Fetcher = (string) => Promise<FetchResult>;

const getFetch = (type: string): Fetcher => {
  switch (type) {
    case 'fake':
      return fake;
    case 'mor':
      return mor;
    default:
      throw new Error(`No fetcher of type ${type}.`);
  }
};

export default getFetch;
