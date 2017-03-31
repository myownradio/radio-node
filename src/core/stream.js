// @flow

import winston from 'winston';
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

  _play() {
    this._fetchNowPlaying()
      .then(now => this._playNow(now))
      .catch(() => this.stop());
  }

  _playNow(now: FetchResult) {
    console.log(`Playing ${now.title}`);
    this.decoderInstance = decode(now.url, now.offset);
    this.decoderInstance
      .on('end', this._playNextOrEndIfTerminated.bind(this))
      .on('error', this._playNextOrEndIfTerminated.bind(this))
      .pipe(wrap(this));
  }

  _fetchNowPlaying(): Promise<FetchResult> {
    return this.fetch(this.channelId);
  }

  _playNextOrEndIfTerminated() {
    if (!this.terminated) {
      winston.log('info', 'Going to play next.');
      this._play();
    } else {
      winston.log('info', 'Going to end.');
      this.end();
    }
  }
}
