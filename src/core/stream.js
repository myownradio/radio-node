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
  decoder: Decoder;

  terminated: boolean = false;

  constructor(backend: string, channelId: string) {
    super();

    this.channelId = channelId;
    this.fetch = getFetch(backend);

    this._play();
  }

  stop() {
    this.terminated = true;
    this.decoder.stop();
  }

  restart() {
    this.emit('restart');
    this.decoder.stop();
  }

  _play() {
    this._fetchNowPlaying()
      .then(now => this._playNow(now))
      .catch(err => process.nextTick(() => this.emit('error', err)));
  }

  _playNow(now: FetchResult) {
    winston.log('info', 'Playing now.', now);
    this.emit('title', now.title);
    this.decoder = decode(now.url, now.offset);
    this.decoder
      .on('end', this._playNextOrEndIfTerminated.bind(this))
      .on('error', err => process.nextTick(() => this.emit('error', err)))
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
