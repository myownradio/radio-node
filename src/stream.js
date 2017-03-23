// @flow

import ffmpeg from 'fluent-ffmpeg';
import { Transform, Writable } from 'stream';
import async from 'async';

import type { FetchResult } from '../src/radio/mor';
import fetch from '../src/radio/mor';

export default class Stream {
  listeners: Array<express$Response>;
  file: string;

  constructor(fileToStream: string) {
    this.listeners = [];
    this.file = fileToStream;
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
    fetch('peaceful-radio').then((data: FetchResult) => {
      console.log(`Now playing ${data.title}`);
      ffmpeg(data.url)
        .native()
        .seekInput(data.offset / 1000)
        .audioCodec('pcm_s16le')
        .audioChannels(2)
        .audioFrequency(44100)
        .outputFormat('s16le')
        .on('end', () => this.pass(to))
        .pipe(to, { end: false });
    });
  }

  run() {
    const that = this;
    const ws = new Writable({
      write(chunk, encoding, callback) {
        async.each(that.listeners, (l, next) => l.write(chunk, encoding, next), callback);
      },
    });

    const transform = new Transform({
      transform(chunk, enc, cb) {
        cb(null, chunk);
      },
    });

    console.log('Starting ffmpeg');
    ffmpeg(transform)
      .inputOptions(['-ac 2', '-ar 44100'])
      .inputFormat('s16le')
      .outputFormat('mp3')
      .pipe(ws, { end: true });

    this.pass(transform);
  }


}
