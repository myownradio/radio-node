// @flow

import { log } from 'winston';

import Player from './player';

const PLAYER_IDLE_TIMEOUT: number = 10000;

export default class Container {
  backend: string;
  players: { [key: string]: Player } = {};
  terminators: { [key: string]: number } = {};

  constructor(backend: string) {
    this.backend = backend;
    log('info', 'Container initialized');
  }

  createOrGetPlayer(channelId: string): Player {
    if (!(channelId in this.players)) {
      log('info', 'Init new player for channel "%s"', channelId);
      this.players[channelId] = this._createPlayer(channelId);
      this._bindPlayerEvents(this.players[channelId]);
    } else {
      log('info', 'Use player for channel "%s"', channelId);
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
    log('info', 'Delete player "%s" from container', channelId);
    delete this.players[channelId];
  }

  _schedulePlayerStop(channelId: string) {
    this.terminators[channelId] = setTimeout(
      this._stopAndRemovePlayer.bind(this),
      PLAYER_IDLE_TIMEOUT,
      channelId,
    );
    log('info', 'Player "%s" is scheduled to shutdown', channelId);
  }

  _cancelPlayerStopIfScheduled(channelId: string) {
    if (channelId in this.terminators) {
      clearTimeout(this.terminators[channelId]);
      delete this.terminators[channelId];
      log('info', 'Player "%s" shutdown is cancelled', channelId);
    }
  }

  _stopAndRemovePlayer(channelId: string) {
    const player = this.players[channelId];
    this._removePlayer(channelId);
    player.stop();
  }
}
