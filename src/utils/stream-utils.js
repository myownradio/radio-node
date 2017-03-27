// @flow

import { Readable, Writable, Transform } from 'stream';

export const createPump = (readable: Readable, writable: Writable): Transform => {
  const pump = new Transform({
    transform(chunk, enc, callback) {
      writable.write(chunk, enc);
      callback();
    },
  });
  readable.on('data', data => pump.push(data));
  return pump;
};

export const isolate = (target: Writable): Writable => new Writable({
  write(chunk: any, enc: any, cb: any): boolean {
    return target.write(chunk, enc, cb);
  },
});

export default { isolate, createPump };
