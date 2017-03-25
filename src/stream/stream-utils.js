// @flow

import { Writable } from 'stream';

export const pass = (target: stream$Writable) => new Writable({
  write(chunk: any, encoding: any, cb: any): boolean {
    return target.write(chunk, encoding, cb);
  },
});

export default { pass };
