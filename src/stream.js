// @flow

import ffmpeg from 'fluent-ffmpeg';
import { PassThrough, Writable } from 'stream';
import async from 'async';

import type { FetchResult, Fetcher } from './fetcher';
import fetcher from './fetcher';
import { throttle } from './flow/transformers';

export default class Stream {
  listeners: Array<express$Response>;
  file: string;
  fetch: Fetcher;

  constructor(fileToStream: string) {
    this.listeners = [];
    this.file = fileToStream;
    this.fetch = fetcher('mor');
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
    this.fetch('wave-of-relax')
      .then((data: FetchResult) => {
        console.log(`Now playing ${data.offset} ${data.title}`);
        ffmpeg(data.url)
          .native()
          .seekInput(String(data.offset / 1000))
          .audioCodec('pcm_s16le')
          .audioChannels(2)
          .audioFrequency(44100)
          .outputFormat('s16le')
          .audioFilter('afade=t=in:st=0:d=1')
          .on('end', () => this.pass(to))
          .pipe(to, { end: false });
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
