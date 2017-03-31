// @flow

import { PassThrough } from 'stream';

import getFetch from '../fetch';
import { decode, Decoder } from './decoder';
import { wrap } from '../utils/stream-utils';

import type { FetchResult } from '../fetch';

export default class Stream extends PassThrough {
  fetch: (string) => Promise<FetchResult>;
  channelId: string;
  decoderInstance: Decoder;

  terminated: boolean = false;

  constructor(backend: string, channelId: string) {
    super();
    this.channelId = channelId;
    this.fetch = getFetch(backend);

    this._play();
  }

  stop() {
    this.terminated = true;
    this.skip();
  }

  skip() {
    this.decoderInstance.stop();
  }

  async _play() {
    const now = await this._fetchNowPlaying();
    this.decoderInstance = decode(now.url, now.offset);
    this.decoderInstance
      .on('end', () => this._play())
      .pipe(wrap(this));
  }

  _fetchNowPlaying(): Promise<FetchResult> {
    return this.fetch(this.channelId);
  }
}
