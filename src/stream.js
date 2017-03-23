// @flow

import ffmpeg from 'fluent-ffmpeg';
import { Transform, Writable } from 'stream';
import fs from 'fs';

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
    const file = fs.createReadStream(this.file);
    // file.on('end', () => this.send(to));
    file.pipe(to);
  }

  run() {
    const that = this;
    const ws = new Writable({
      write(chunk, encoding, callback) {
        that.listeners.forEach(l => l.write(chunk, encoding));
        callback();
      },
    });

    const transform = new Transform({
      transform(chunk, enc, cb) {
        cb(null, chunk);
        //this.push(chunk, enc, cb);
      },
    });

    console.log('Starting ffmpeg');
    ffmpeg(transform)
      .native()
      .outputFormat('mp3')
      .pipe(ws, { end: true });

    this.pass(transform);
  }


}
