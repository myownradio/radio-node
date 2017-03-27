// @flow

import { PassThrough } from 'stream';
import ffmpeg from 'fluent-ffmpeg';

import { createPump } from '../utils/stream-utils';

import { DECODER_FORMAT, DECODER_CHANNELS, DECODER_FREQUENCY } from './decoder';

export const ENC_OUTPUT_FORMAT = 'mp3';
export const ENC_CHANNELS = 2;
export const ENC_BITRATE = '64k';
export const ENC_FILTER = 'compand=0 0:1 1:-90/-900 -70/-70 -21/-21 0/-15:0.01:12:0:0';

export const createEncoder = (): stream$Transform => {
  const encoderInput = new PassThrough();
  const encoderOutput = new PassThrough();

  const pump = createPump(encoderOutput, encoderInput)

  ffmpeg(encoderInput)
    .inputOptions([
      `-ac ${DECODER_CHANNELS}`,
      `-ar ${DECODER_FREQUENCY}`,
    ])
    .inputFormat(DECODER_FORMAT)
    .audioBitrate(ENC_BITRATE)
    .audioChannels(ENC_CHANNELS)
    .outputFormat(ENC_OUTPUT_FORMAT)
    .audioFilter(ENC_FILTER)
    .on('error', () => pump.emit('error', ...arguments))
    .pipe(encoderOutput);

  return pump;
};

export default { createEncoder };
