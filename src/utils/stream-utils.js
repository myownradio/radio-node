// @flow

import { Readable, Writable, Transform, PassThrough } from 'stream';

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
  return transform;
};

export const createTransformWithConnectors = () => {
  const input = new PassThrough();
  const output = new PassThrough();
  const transform = combine(output, input);
  return { input, output, transform };
};

export const wrap = (target: Writable): Writable => new Writable({
  write(chunk: any, enc: any, cb: any): boolean {
    return target.write(chunk, enc, cb);
  },
});

export const pipeWithError = (src: any, dst: any) => {
  src.on('error', error => dst.emit('error', error));
  src.pipe(dst);
};

export const unpipeOnCloseOrError = (src: Readable, dst: Writable) => {
  const unpipe = () => {
    src.unpipe(dst);
    src.resume();
  };
  dst.on('close', () => unpipe());
  dst.on('error', () => unpipe());
};

export default {
  wrap,
  combine,
  pipeWithError,
  createTransformWithConnectors,
  unpipeOnCloseOrError,
};
