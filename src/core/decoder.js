// @flow

import ffmpeg from 'fluent-ffmpeg';
import { PassThrough } from 'stream';

const FADEIN_FILTER = 'afade=t=in:st=0:d=1';

export const DECODER_CHANNELS = 2;
export const DECODER_FREQUENCY = 44100;
export const DECODER_FORMAT = 's16le';
export const AUDIO_CODEC = 'pcm_s16le';

class CloseableReadable extends PassThrough {
  closeCallback: () => void;
  constructor(closeCallback: () => void) {
    super();
    this.closeCallback = closeCallback;
  }
  close() {
    this.closeCallback();
  }
}

export const decode = (url: string, offset: number): CloseableReadable => {
  const builder = ffmpeg(url)
    .native()
    .seekInput(offset / 1000)
    .audioCodec(AUDIO_CODEC)
    .audioChannels(DECODER_CHANNELS)
    .audioFrequency(DECODER_FREQUENCY)
    .outputFormat(DECODER_FORMAT)
    .audioFilter(FADEIN_FILTER);

  const stream = new CloseableReadable(() => builder.kill());

  builder.on('error', (err, stdout, stderr) =>
    stream.emit('error', { err, stdout, stderr }));

  return builder.pipe(new CloseableReadable(() => builder.kill()));
};

export default { decode };
