// @flow

import express from 'express';

import Container from './core/container';

const startServer = (port: number, backend: string) => {
  console.log(`Listening to the port: ${port}`);
  console.log(`Selected backend: ${backend}`);
  console.log();

  const app: express$Application = express();
  const container: Container = new Container(backend);

  app.get('/', (req: express$Request, res: express$Response) => {
    res.send('Hello, World!');
  });

  app.get('/test', (req: express$Request, res: express$Response) => {
    res.header('Content-Type', 'audio/mpeg');

    container
      .createOrGetPlayer('martas-vk')
      .addClient(res);
  });

  app.listen(port);
};

export default startServer;
