// @flow

import ffmpeg from 'fluent-ffmpeg';

export const DECODER_CHANNELS = 2;
export const DECODER_FREQUENCY = 44100;
export const DECODER_FORMAT = 's16le';
export const DECODER_CODEC = 'pcm_s16le';

const resetPipeListeners = (stream: stream$Writable) => {
  stream.removeAllListeners('error');
  stream.removeAllListeners('close');
};

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
    .on('end', () => {
      resetPipeListeners(targetStream);
      nextCallback();
    })
    .on('error', (error) => {
      console.error(error);
      setTimeout(nextCallback, 1000);
    })
    .pipe(targetStream, { end: false });
};
