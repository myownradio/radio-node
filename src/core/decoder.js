// @flow

import ffmpeg from 'fluent-ffmpeg';
import { PassThrough } from 'stream';

const FADEIN_FILTER = 'afade=t=in:st=0:d=1';

export const DECODER_CHANNELS = 2;
export const DECODER_FREQUENCY = 44100;
export const DECODER_FORMAT = 's16le';
export const AUDIO_CODEC = 'pcm_s16le';

export const decode = (url: string, offset: number): stream$Readable => {
  const out = new PassThrough();
  const onError = (err, stdout, stderr) =>
    out.emit('error', { err, stdout, stderr });

  return ffmpeg(url)
    .native()
    .seekInput(offset / 1000)
    .audioCodec(AUDIO_CODEC)
    .audioChannels(DECODER_CHANNELS)
    .audioFrequency(DECODER_FREQUENCY)
    .outputFormat(DECODER_FORMAT)
    .audioFilter(FADEIN_FILTER)
    .on('error', onError)
    .pipe(out);
};

export default { decode };
