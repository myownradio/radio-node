// @flow

import express from 'express';

import AdhocStream from './stream';

const startServer = (port: number, backend: string) => {
  console.log(`Listening to the port: ${port}`);
  console.log(`Selected backend: ${backend}`);
  console.log();

  const app: express$Application = express();
  const stream = new AdhocStream(backend);

  app.get('/', (req: express$Request, res: express$Response) => {
    res.send('Hello, World!');
  });

  app.get('/test', (req: express$Request, res: express$Response) => {
    res.header('Content-Type', 'audio/mpeg');
    stream.subscribe(res);
  });

  app.listen(port);
};

export default startServer;
