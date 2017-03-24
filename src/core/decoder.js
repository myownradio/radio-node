// @flow

import ffmpeg from 'fluent-ffmpeg';

export default (sourceUrl: string, offsetMillis: number, targetStream: stream$Writable,
  nextCallback: () => void) => {
  ffmpeg(sourceUrl)
    .native()
    .seekInput(offsetMillis / 1000)
    .audioCodec('pcm_s16le')
    .audioChannels(2)
    .audioFrequency(44100)
    .outputFormat('s16le')
    .audioFilter('afade=t=in:st=0:d=1')
    .once('end', () => {
      targetStream.removeAllListeners('error');
      targetStream.removeAllListeners('close');
      nextCallback();
    })
    .pipe(targetStream, { end: false });
};
