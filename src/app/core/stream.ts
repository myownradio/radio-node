// @flow

import { PassThrough } from 'stream';

import { module } from '../utils/log-utils';
import { decode, Decoder } from './decoder';
import { wrap } from '../utils/stream-utils';

import { BackendService, NowPlaying } from "../service/backend";

export default class Stream extends PassThrough {
  backendService: BackendService;
  channelId: string;
  decoder: Decoder;
  log = module(this);

  terminated: boolean = false;

  constructor(backendService: BackendService, channelId: string) {
    super();

    this.log('info', 'Initialized');

    this.channelId = channelId;
    this.backendService = backendService;

    this._play();
  }

  stop() {
    this.log('info', 'Stop');
    this.terminated = true;
    this.decoder.stop();
  }

  restart() {
    this.log('info', 'Restart');
    this.emit('restart');
    this.decoder.stop();
  }

  _play() {
    this.log('info', 'Play');
    this._fetchNowPlaying()
      .then(now => this._playNow(now))
      .catch(err => process.nextTick(() => this.emit('error', err)));
  }

  _playNow(now: NowPlaying) {
    this.log('info', 'Playing now "%s" from %d ms', now.title, now.offset);
    this.emit('title', now.title);
    this.decoder = decode(now.url, now.offset);
    this.decoder
      .on('end', this._playNextOrEndIfTerminated.bind(this))
      .on('error', err => process.nextTick(() => this.emit('error', err)))
      .pipe(wrap(this));
  }

  _fetchNowPlaying(): Promise<NowPlaying> {
    return this.backendService.getNowPlaying(this.channelId);
  }

  _playNextOrEndIfTerminated() {
    if (!this.terminated) {
      this.log('info', 'Going to play next');
      this._play();
    } else {
      this.log('info', 'Going to stop');
      this.end();
    }
  }

  toString(): string {
    return `stream(channelId=${this.channelId})`;
  }
}
