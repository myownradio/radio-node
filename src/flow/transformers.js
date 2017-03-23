// @flow

import { Transform } from 'stream';
import Throttle from 'throttle';

export const proxy = () => new Transform({
  transform(chunk, enc, cb) {
    cb(null, chunk);
  },
});

export const throttle = bps => new Throttle(bps);

export default { proxy, throttle };
