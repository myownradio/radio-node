// @flow

import { PassThrough } from 'stream';

import { isolate } from './utils/stream-utils';
import type { FetchResult, Fetcher } from './fetch';
import fetcher from './fetch';
import { decode } from './core/decoder';
import { createEncoder } from './core/encoder';

import MultiWritable from './core/multiwritable';

export default class Stream {
  fetch: Fetcher;
  multi: MultiWritable = new MultiWritable();

  constructor(backend: string) {
    this.fetch = fetcher(backend);
    this.run();
  }

  subscribe(output: express$Response) {
    this.multi.addClient(output);
  }

  pass(to: stream$Writable) {
    console.log('Fetching now playing...');
    this.fetch('martas-vk')
      .then((data: FetchResult) => {
        console.log(`Now playing ${data.offset} ${data.title}`);
        let terminator;
        const stream = decode(data.url, data.offset);
        stream.on('end', () => {
          clearTimeout(terminator);
          this.pass(to);
        })
        .on('error', () => {
          console.error('Decoder exited with error.');
        })
        .pipe(isolate(to));
      })
      .catch(err => console.error(err));
  }

  run() {
    const pt = new PassThrough();

    pt.pipe(createEncoder()).pipe(this.multi);

    this.pass(pt);
  }


}
