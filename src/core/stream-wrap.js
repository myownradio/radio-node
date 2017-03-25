// @flow

import { Writable } from 'stream';

export default (target: stream$Writable) => new Writable({
  write(chunk: any, encoding: any, cb: any): boolean {
    return target.write(chunk, encoding, cb);
  },
});
