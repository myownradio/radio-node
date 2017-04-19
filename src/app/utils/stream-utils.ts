import { Readable, Writable, Transform, PassThrough } from 'stream';
import { Consumer } from "./types";

const readAll = (readable: Readable, consumer: Consumer<any>, callback: Function) => {
  const consume = () => {
    const data = readable.read();
    if (data !== null) {
      consumer(data);
      consume();
    } else {
      callback();
    }
  };
  consume();
};

export const combine = (readable: Readable, writable: Writable): Transform => {
  return new Transform({
    transform(chunk: Buffer, enc: string, callback: Function) {
      writable.write(chunk, enc);
      readAll(readable, data => this.push(data), callback);
    },
    flush(callback: Function) {
      writable.end(undefined, undefined, callback);
    },
  });
};

export const createTransformWithConnectors = () => {
  const input = new PassThrough();
  const output = new PassThrough();
  const transform = combine(output, input);
  return { input, output, transform };
};

export const wrap = (target: Writable): Writable => new Writable({
  write(chunk: Buffer, enc: string, cb: Function): boolean {
    return target.write(chunk, enc, cb);
  },
});

export const pipeWithError = (src: Readable, dst: Writable) => {
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
