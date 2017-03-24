// @flow

import express from 'express';

import RadioStreamer from './stream';

const startServer = (port: number, backend: string) => {
  console.log(`Server will listen on port: ${port}`);
  console.log(`Selected backend: ${backend}`);
  console.log();

  const app: express$Application = express();
  const streamer = new RadioStreamer(backend);


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
    const { channelId } = req.params;
    res.json({ channelId });
  });

  app.listen(port);
};

export default startServer;
