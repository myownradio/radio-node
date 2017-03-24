// @flow

import async from 'async';
import ffmpeg from 'fluent-ffmpeg';
import { PassThrough, Writable } from 'stream';

import clients from './client';

export type Streamer = {};

export default (channelId: string, backend: string) => {
  const clients = [];
  const encoderInput: stream$Writable = new PassThrough();

  const startEncoder = () => {
    const multiStream = new Writable({
      write(chunk, encoding, callback) {
        async.each(clients, (l, next) => l.write(chunk, encoding, next), callback);
      },
    });

    ffmpeg(encoderInput)
      .inputOptions(['-ac 2', '-ar 44100'])
      .inputFormat('s16le')
      .outputFormat('mp3')
      .audioFilter('compand=0 0:1 1:-90/-900 -70/-70 -21/-21 0/-15:0.01:12:0:0')
      .pipe(multiStream, { end: true });
  };

  startEncoder();

  return {
    clientsCount() {
      return clients.length;
    },
  };
};
