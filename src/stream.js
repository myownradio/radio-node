// @flow

import ffmpeg from 'fluent-ffmpeg';
import stream from 'stream-wrapper';

export default class Stream {
  listeners: Array<express$Response>;
  file: string;

  constructor(fileToStream: string) {
    this.listeners = [];
    this.file = fileToStream;
    this.run();
  }

  subscribe(output: express$Response) {
    output.on('error', () => {
      console.log('client down');
      this.listeners = this.listeners.filter(listener => listener !== output);
    });
    this.listeners.push(output);
  }

  run() {
    const ws = stream.writable((chunk, enc, cb) => {
      this.listeners.forEach(l => l.write(chunk, enc));
      cb();
    });

    console.log('Starting');
    ffmpeg(this.file)
      .native()
      .outputFormat('mp3')
      .on('end', () => this.run())
      .on('error', (err) => {
        console.log(`an error happened: ${err.message}`);
      })
      .pipe(ws, { end: true });
  }
}
