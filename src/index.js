// @flow

import express from 'express';

import { module } from './utils/log-utils';
import Container from './core/container';
import getFetch from './fetch';

const startServer = (port: number, backend: string) => {
  const log = module('app');

  log('info', 'Listening on the port: %d', port);
  log('info', 'Selected backend: %s', backend);

  const app: express$Application = express();
  const container: Container = new Container(backend);
  const fetch = getFetch(backend);

  app.set('view engine', 'jade');
  app.set('views', './views');

  app.get('/', (req: express$Request, res: express$Response) => {
    const players = container.players;
    res.render('index', { players, backend });
  });

  app.get('/stats', (req: express$Request, res: express$Response) => {
    res.status(200).json({
      players: container.countPlayers(),
      clients: container.countClients(),
    });
  });

  app.use('/audio/:channelId', (req: express$Request, res: express$Response, next) => {
    fetch(req.params.channelId)
      .then(() => next())
      .catch(() => res.status(404).send('Not found'));
  });

  app.get('/audio/:channelId', (req: express$Request, res: express$Response) => {
    const player = container.createOrGetPlayer(req.params.channelId);
    player.addClient(res);
  });

  app.listen(port);
};

export default startServer;
