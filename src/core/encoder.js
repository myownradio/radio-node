// @flow

import { Writable, PassThrough } from 'stream';
import ffmpeg from 'fluent-ffmpeg';

import { DECODER_FORMAT, DECODER_CHANNELS, DECODER_FREQUENCY } from './decoder';

export const ENCODER_OUTPUT_FORMAT = 'mp3';

export default class Encoder extends Writable {
  wire: stream$Writable;

  constructor(output: stream$Writable) {
    super();
    this.wire = new PassThrough();
    this.initEncoder(output);
  }

  write(chunk: any, encoding: any, callback: any): boolean {
    return this.wire.write(chunk, encoding, callback);
  }

  end(chunk: any, encoding: any, callback: any) {
    super.end(chunk, encoding, callback);
    this.wire.end();
  }

  close() {
    this.wire.end();
  }

  initEncoder(output: stream$Writable) {
    ffmpeg(this.wire)
      .inputOptions([
        `-ac ${DECODER_CHANNELS}`,
        `-ar ${DECODER_FREQUENCY}`,
      ])
      .inputFormat(DECODER_FORMAT)
      .outputFormat(ENCODER_OUTPUT_FORMAT)
      .audioFilter('compand=0 0:1 1:-90/-900 -70/-70 -21/-21 0/-15:0.01:12:0:0')
      .pipe(output, { end: true });
  }
}
