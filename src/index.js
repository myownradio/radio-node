// @flow

import express from 'express';
import ffmpeg from 'fluent-ffmpeg';
import * as fs from 'fs';

const startServer = (port: number) => {
  const app: express$Application = express();

  app.get('/', (req: express$Request, res: express$Response) => {
    res.send('Hello, World!');
  });

  app.get('/ping', (req: express$Request, res: express$Response) => {
    res.header('Content-Type', 'text/plain');
    res.send('pong');
  });

  app.get('/test', (req: express$Request, res: express$Response) => {
    ffmpeg(fs.createReadStream('__tests__/__fixtures__/demo.mp3'))
      .outputFormat('mp3')
      .on('end', () => {
        console.log('file has been converted successfully');
      })
      .on('error', (err) => {
        console.log(`an error happened: ${err.message}`);
      })
      .pipe(res, { end: true });
  });

  app.get('/channel/:channelId', (req: express$Request, res: express$Response) => {
    res.json(req.params);
  });

  app.listen(port);
};

export default startServer;
