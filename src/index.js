// @flow

import express from 'express';

import Container from './core/container';
import getFetch from './fetch';

const startServer = (port: number, backend: string) => {
  console.log(`Listening to the port: ${port}`);
  console.log(`Selected backend: ${backend}`);
  console.log();

  const app: express$Application = express();
  const container: Container = new Container(backend);
  const fetch = getFetch(backend);

  app.get('/', (req: express$Request, res: express$Response) => {
    res.send('Hello, World!');
  });

  app.get('/audio/:channelId', (req: express$Request, res: express$Response) => {
    const channelId = req.params.channelId;

    fetch(channelId)
      .then(() => {
        const player = container.createOrGetPlayer(req.params.channelId);
        player.addClient(res);
      })
      .catch(() => {
        res.status(404).send('Not found');
      });
  });

  app.listen(port);
};

export default startServer;
