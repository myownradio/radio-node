// @flow

import winston from 'winston';

import Player from './player';

type PlayerMap = { [key: string]: Player };

export default class Container {
  backend: string;
  players: PlayerMap = {};

  constructor(backend: string) {
    this.backend = backend;
    winston.log('info', 'Initialized players container');
  }

  createOrGetPlayer(channelId: string): Player {
    winston.log('info', 'Looking for player', { channelId });
    if (!(channelId in this.players)) {
      winston.log('info', 'There is no player so we create it', { channelId });
      this.players[channelId] = this._createPlayer(channelId);
    }
    return this.players[channelId];
  }

  _createPlayer(channelId: string): Player {
    const player = new Player(this.backend, channelId);
    player.on('stop', () => this._removePlayer(channelId));
    return player;
  }

  _removePlayer(channelId: string) {
    winston.log('info', 'Removing player from container', { channelId });
    delete this.players[channelId];
  }
}
