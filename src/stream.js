// @flow

import { PassThrough, Writable } from 'stream';
import async from 'async';

import { isolate } from './utils/stream-utils';
import type { FetchResult, Fetcher } from './fetch';
import fetcher from './fetch';
import { decode } from './core/decoder';
import { createEncoder } from './core/encoder';

export default class Stream {
  listeners: Array<express$Response>;
  fetch: Fetcher;

  constructor(backend: string) {
    this.listeners = [];
    this.fetch = fetcher(backend);
    this.run();
  }

  subscribe(output: express$Response) {
    output.on('close', () => {
      console.log('listener gone');
      this.listeners = this.listeners.filter(listener => listener !== output);
    });
    console.log('new listener');
    this.listeners.push(output);
  }

  pass(to: stream$Writable) {
    console.log('Fetching now playing...');
    this.fetch('martas-vk')
      .then((data: FetchResult) => {
        console.log(`Now playing ${data.offset} ${data.title}`);
        let terminator;
        const { stream } = decode(data.url, data.offset);
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
    const that = this;
    const ws = new Writable({
      write(chunk, encoding, callback) {
        async.each(that.listeners, (l, next) => l.write(chunk, encoding, next), callback);
      },
    });

    const pt = new PassThrough();

    pt.pipe(createEncoder()).pipe(ws);

    this.pass(pt);
  }


}
