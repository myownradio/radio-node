import * as ffmpeg from 'fluent-ffmpeg';
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

export class Decoder extends PassThrough {
  url: string;
  offset: number;
  decoder: ffmpeg;

  terminated: boolean = false;

  constructor(url: string, offset: number = 0) {
    super();
    this.url = url;
    this.offset = millisToSeconds(offset);
    this._initDecoder();
  }

  _initDecoder() {
    const decoder = buildDecoder();

    decoder
      .input(this.url)
      .seekInput(this.offset)
      .native()
      .on('error', this._handleError.bind(this))
      .pipe(this);

    this.decoder = decoder;
  }

  stop() {
    this.terminated = true;
    this.decoder.kill();
  }

  _handleError(error: Error) {
    if (!this.terminated) {
      process.nextTick(() => this.emit('error', error));
    }
  }
}

export const decode = (url: string, offset: number): Decoder =>
  new Decoder(url, offset);

export default { decode };
