// @flow

import * as express from 'express';

import { module } from './utils/log-utils';
import Container from './core/container';
import { BackendService, getBackendService } from './service/backend';

const log = module('app');

const startServer = (port: number, backend: string) => {
  getBackendService(backend).then(backendService => startApplication(port, backendService));
};

const startApplication = (port: number, backendService: BackendService) => {

  log('info', 'Active backend service: %s', backendService.name);
  log('info', 'Listening on the port: %d', port);

  const app: express.Application = express();
  const container: Container = new Container(backendService);

  app.set('view engine', 'jade');
  app.set('views', './views');

  app.get('/', (req: express.Request, res: express.Response) => {
    const players = container.players;
    const version = process.env.npm_package_version;
    res.render('index', { players, backendService, version });
  });

  app.get('/stats', (req: express.Request, res: express.Response) => {
    res.status(200).json({
      players: container.countPlayers(),
      clients: container.countClients(),
    });
  });

  app.use('/audio/:channelId', (req: express.Request, res: express.Response, next) => {
    backendService.getNowPlaying(req.params.channelId)
        .then(() => next())
        .catch(() => res.status(404).send('Not found'));
  });

  app.get('/audio/:channelId', (req: express.Request, res: express.Response) => {
    const player = container.createOrGetPlayer(req.params.channelId);
    player.addClient(res);
  });

  app.listen(port);
};

export default startServer;
