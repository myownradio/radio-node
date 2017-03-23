// @flow

import express from 'express';

const startServer = (port: number) => {
  const app: express$Application = express();

  app.get('/', (req: express$Request, res: express$Response) => {
    res.send('Hello, World!');
  });

  app.get('/ping', (req: express$Request, res: express$Response) => {
    res.header('Content-Type', 'text/plain');
    res.send('pong');
  });

  app.get('/channel/:channelId', (req: express$Request, res: express$Response) => {
    res.json(req.params);
  });

  app.listen(port);
};

export default startServer;
