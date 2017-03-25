// @flow

import MultiWritable from './multiwritable';
import Encoder from './encoder';
import decoder from './decoder';
import player from './player';

export default (backend: string, channelId: string) => {
  const multiWritable = new MultiWritable();
  const rawWritable = new Encoder(multiWritable);
  const fetchNow = player(backend);

  const cycle = () => {
    fetchNow(channelId)
      .then(now => decoder(now.url, now.offset, rawWritable, cycle));
  };

  cycle();

  return {
    addClient(listener: stream$Writable) {
      multiWritable.addClient(listener);
    },
    stop() {
      this.multiWritable.close();
      this.encoder.close();
    },
  };
};
