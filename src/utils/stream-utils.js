// @flow

import { Readable, Writable, Transform, PassThrough } from 'stream';

export const pipeToTransform = (src: Readable, dst: Transform): Transform => {
  src.on('data', data => dst.push(data));
  src.on('end', () => dst.push(null));
  return dst;
};

export const combine = (readable: Readable, writable: Writable): Transform => {
  const transform = new Transform({
    transform(chunk, enc, callback) {
      writable.write(chunk, enc, callback);
    },
    flush(callback) {
      writable.end(undefined, undefined, callback);
    },
  });
  return pipeToTransform(readable, transform);
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
  dst.on('close', () => src.unpipe(dst));
  dst.on('error', () => src.unpipe(dst));
};

export default {
  wrap,
  combine,
  pipeWithError,
  createTransformWithConnectors,
  pipeToTransform,
  unpipeOnCloseOrError,
};
