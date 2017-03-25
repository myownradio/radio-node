// @flow

import MultiWritable from './multiwritable';
import Encoder from './encoder';
import player from './player';

export default (backend: string, channelId: string) => {
  const multiWritable = new MultiWritable();
  const encoder = new Encoder(multiWritable);
  const player = player();

  return {
    stop() {
      this.multiWritable.close();
      this.encoder.close();
    },
  };
};
