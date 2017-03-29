// @flow

import { Readable, Writable, Transform } from 'stream';

export const combine = (readable: Readable, writable: Writable): Transform => {
  const transform = new Transform({
    transform(chunk, enc, callback) {
      writable.write(chunk, enc, callback);
    },
    flush(callback) {
      writable.end(undefined, undefined, callback);
    },
  });
  readable.on('data', data => transform.push(data));
  readable.on('end', () => transform.push(null));
  return transform;
};

export const isolate = (target: Writable): Writable => new Writable({
  write(chunk: any, enc: any, cb: any): boolean {
    return target.write(chunk, enc, cb);
  },
});

export default { isolate, combine };
