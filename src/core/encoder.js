// @flow

import { Writable, PassThrough } from 'stream';
import ffmpeg from 'fluent-ffmpeg';

export default class Encoder extends Writable {
  output: stream$Writable;
  wire: stream$Writable;

  constructor(output: stream$Writable) {
    super();
    this.output = output;
    this.wire = new PassThrough();
    this.initEncoder();
  }

  write(chunk: any, encoding: any, callback: any): boolean {
    return this.wire.write(chunk, encoding, callback);
  }

  close() {
    this.wire.end();
  }

  initEncoder() {
    ffmpeg(this.wire)
      .inputOptions(['-ac 2', '-ar 44100'])
      .inputFormat('s16le')
      .outputFormat('mp3')
      .audioFilter('compand=0 0:1 1:-90/-900 -70/-70 -21/-21 0/-15:0.01:12:0:0')
      .pipe(this.output, { end: true });
  }
}
