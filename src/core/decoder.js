// @flow

import ffmpeg from 'fluent-ffmpeg';

import { pass } from '../utils/stream-utils';

export const DECODER_CHANNELS = 2;
export const DECODER_FREQUENCY = 44100;
export const DECODER_FORMAT = 's16le';
export const DECODER_CODEC = 'pcm_s16le';

export default (sourceUrl: string, offsetMillis: number, targetStream: stream$Writable,
  nextCallback: () => void) => {
  ffmpeg(sourceUrl)
    .native()
    .seekInput(offsetMillis / 1000)
    .audioCodec(DECODER_CODEC)
    .audioChannels(DECODER_CHANNELS)
    .audioFrequency(DECODER_FREQUENCY)
    .outputFormat(DECODER_FORMAT)
    .audioFilter('afade=t=in:st=0:d=1')
    .on('end', () => nextCallback())
    .on('error', (error) => {
      console.error(error);
      setTimeout(nextCallback, 1000);
    })
    .pipe(pass(targetStream));
};
