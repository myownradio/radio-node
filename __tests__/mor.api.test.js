// @flow

import fetch from '../src/radio/mor';

it('should return playing', async () => {
  const result = await fetch('35');
  console.log(result);
});
