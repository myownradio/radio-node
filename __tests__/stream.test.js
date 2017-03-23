// @flow

import { Transform } from 'stream';

it('should work', () => {
  expect.assertions(1);
  const expected = new Buffer('foo-bar');
  const readable = new Transform({
    transform(chunk, enc, cb) {
      // this.push(chunk, enc, cb);
      cb(null, chunk);
    },
  });
  readable.on('data', (chunk) => {
    expect(chunk).toBe(expected);
  });
  readable.write(expected);
});
