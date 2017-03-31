// @flow

import Player from './player';

type PlayerMap = { [key: string]: Player };

export default class Container {
  backend: string;
  players: PlayerMap = {};

  constructor(backend: string) {
    this.backend = backend;
  }

  createOrGetPlayer(channelId: string): Player {
    if (!(channelId in this.players)) {
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
    delete this.players[channelId];
  }
}
