// @flow

import ffmpeg from 'fluent-ffmpeg';
import { PassThrough, Writable } from 'stream';
import async from 'async';

import { pass } from './utils/stream-utils';
import type { FetchResult, Fetcher } from './fetch';
import fetcher from './fetch';
import { decode } from './core/decoder';

export default class Stream {
  listeners: Array<express$Response>;
  fetch: Fetcher;

  constructor(backend: string) {
    this.listeners = [];
    this.fetch = fetcher(backend);
    this.run();
  }

  subscribe(output: express$Response) {
    output.on('close', () => {
      console.log('listener gone');
      this.listeners = this.listeners.filter(listener => listener !== output);
    });
    console.log('new listener');
    this.listeners.push(output);
  }

  pass(to: stream$Writable) {
    console.log('Fetching now playing...');
    this.fetch('104')
      .then((data: FetchResult) => {
        console.log(`Now playing ${data.offset} ${data.title}`);
        decode(data.url, data.offset)
          .on('end', () => this.pass(to))
          .on('error', () => this.pass(to))
          .pipe(pass(to));
        console.log('----');
      })
      .catch(err => console.error(err));
  }

  run() {
    const that = this;
    const ws = new Writable({
      write(chunk, encoding, callback) {
        async.each(that.listeners, (l, next) => l.write(chunk, encoding, next), callback);
      },
    });

    const pt = new PassThrough();

    console.log('Starting ffmpeg');
    ffmpeg(pt)
      .inputOptions(['-ac 2', '-ar 44100'])
      .inputFormat('s16le')
      .outputFormat('mp3')
      .audioFilter('compand=0 0:1 1:-90/-900 -70/-70 -21/-21 0/-15:0.01:12:0:0')
      .pipe(ws, { end: true });

    this.pass(pt);
  }


}
