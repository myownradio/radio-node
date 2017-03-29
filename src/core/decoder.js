// @flow

import ffmpeg from 'fluent-ffmpeg';
import { PassThrough } from 'stream';

import { millisToSeconds } from '../utils/time-utils';

const FADEIN_FILTER = 'afade=t=in:st=0:d=1';

export const DECODER_CHANNELS = 2;
export const DECODER_FREQUENCY = 44100;
export const DECODER_FORMAT = 's16le';
export const AUDIO_CODEC = 'pcm_s16le';

const buildDecoder = () =>
  ffmpeg()
    .audioCodec(AUDIO_CODEC)
    .audioChannels(DECODER_CHANNELS)
    .audioFrequency(DECODER_FREQUENCY)
    .outputFormat(DECODER_FORMAT)
    .audioFilter(FADEIN_FILTER);

class DecodedStream extends PassThrough {
  url: string;
  offset: number;
  decoder: ffmpeg;

  constructor(url: string, offset: number) {
    super();
    this.url = url;
    this.offset = millisToSeconds(offset);
    this._initDecoder();
  }

  _initDecoder() {
    this.decoder = buildDecoder()
      .input(this.url)
      .seekInput(this.offset)
      .native()
      .on('error', err => this.emit('error', err))
      .pipe(this);
  }

  close() {
    this.decoder.kill();
  }
}

export const decode = (url: string, offset: number): DecodedStream =>
  new DecodedStream(url, offset);

export default { decode };
