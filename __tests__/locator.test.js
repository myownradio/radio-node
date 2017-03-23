// @flow

import locate from '../src/cmd/locator';

it('should locate ffmpeg', async () => {
  const ffmpeg = await locate('ffmpeg');
  expect(ffmpeg).toContain('/ffmpeg');
});

it('should not locate non existent command', async () => {
  expect.assertions(1);
  try {
    await locate('nonexistent');
  } catch (err) {
    expect(err).toMatch(/not found/);
  }
});
