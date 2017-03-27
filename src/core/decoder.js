// @flow

import ffmpeg from 'fluent-ffmpeg';
import { PassThrough } from 'stream';

const FADEIN_FILTER = 'afade=t=in:st=0:d=1';

export const DECODER_CHANNELS = 2;
export const DECODER_FREQUENCY = 44100;
export const DECODER_FORMAT = 's16le';
export const AUDIO_CODEC = 'pcm_s16le';

export type DecodeResult = {
  stream: stream$Readable,
  stop: () => void
};

export const decode = (url: string, offset: number): DecodeResult => {
  const builder = ffmpeg(url);
  const stop = () => builder.kill();

  const stream = builder
    .native()
    .seekInput(offset / 1000)
    .audioCodec(AUDIO_CODEC)
    .audioChannels(DECODER_CHANNELS)
    .audioFrequency(DECODER_FREQUENCY)
    .outputFormat(DECODER_FORMAT)
    .audioFilter(FADEIN_FILTER)
    .on('error', (err, stdout, stderr) =>
      stream.emit('error', { err, stdout, stderr }))
    .pipe(new PassThrough());

  return { stream, stop };
};

export default { decode };
