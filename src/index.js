// @flow

import express from 'express';

import RadioStreamer from './stream';

const startServer = (port: number) => {
  const app: express$Application = express();
  const streamer = new RadioStreamer('__tests__/__fixtures__/demo.mp3');

  app.get('/', (req: express$Request, res: express$Response) => {
    res.send('Hello, World!');
  });

  app.get('/ping', (req: express$Request, res: express$Response) => {
    res.header('Content-Type', 'text/plain');
    res.send('pong');
  });

  app.get('/test', (req: express$Request, res: express$Response) => {
    res.header('Content-Type', 'audio/mpeg');
    streamer.subscribe(res);
  });

  app.get('/channel/:channelId', (req: express$Request, res: express$Response) => {
    res.json(req.params);
  });

  app.listen(port);
};

export default startServer;
