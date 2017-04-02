// @flow

import winston from 'winston';

import Player from './player';

const PLAYER_IDLE_TIMEOUT: number = 10000;

export default class Container {
  backend: string;
  players: { [key: string]: Player } = {};
  terminators: { [key: string]: number } = {};

  constructor(backend: string) {
    this.backend = backend;
    winston.log('info', 'Players container initialized.');
  }

  createOrGetPlayer(channelId: string): Player {
    if (!(channelId in this.players)) {
      winston.log('info', 'Initializing player.', { channelId });
      this.players[channelId] = this._createPlayer(channelId);
      this._bindPlayerEvents(this.players[channelId]);
    }
    return this.players[channelId];
  }

  _bindPlayerEvents(player: Player) {
    const channelId = player.channelId;
    player.on('new', () => this._cancelPlayerStopIfScheduled(channelId));
    player.on('idle', () => this._schedulePlayerStop(channelId));
  }

  _createPlayer(channelId: string): Player {
    return new Player(this.backend, channelId);
  }

  _removePlayer(channelId: string) {
    delete this.players[channelId];
    winston.log('info', 'Player removed from container.', { channelId });
  }

  _schedulePlayerStop(channelId: string) {
    this.terminators[channelId] = setTimeout(
      this._stopAndRemovePlayer.bind(this),
      PLAYER_IDLE_TIMEOUT,
      channelId,
    );
    winston.log('info', 'Player is scheduled to shutdown.', { channelId });
  }

  _cancelPlayerStopIfScheduled(channelId: string) {
    if (channelId in this.terminators) {
      clearTimeout(this.terminators[channelId]);
      delete this.terminators[channelId];
      winston.log('info', 'Player shutdown is cancelled.', { channelId });
    }
  }

  _stopAndRemovePlayer(channelId: string) {
    const player = this.players[channelId];
    this._removePlayer(channelId);
    player.stop();
  }
}
