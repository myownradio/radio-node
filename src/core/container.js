// @flow

import _ from 'lodash';

import { module } from '../utils/log-utils';
import Player from './player';

const PLAYER_IDLE_TIMEOUT: number = 10000;

export default class Container {
  backend: string;
  players: { [key: string]: Player } = {};
  terminators: { [key: string]: number } = {};
  log = module(this);

  constructor(backend: string) {
    this.backend = backend;
    this.log('info', 'Initialized');
  }

  createOrGetPlayer(channelId: string): Player {
    if (!(channelId in this.players)) {
      this.log('info', 'Create player for channel "%s"', channelId);
      this.players[channelId] = this._createPlayer(channelId);
      this._bindPlayerEvents(this.players[channelId]);
    } else {
      this.log('info', 'Attach to player for channel "%s"', channelId);
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
    this.log('info', 'Delete player "%s" from container', channelId);
    delete this.players[channelId];
  }

  _schedulePlayerStop(channelId: string) {
    this.terminators[channelId] = setTimeout(
      this._stopAndRemovePlayer.bind(this),
      PLAYER_IDLE_TIMEOUT,
      channelId,
    );
    this.log('info', 'Player "%s" is scheduled to shutdown', channelId);
  }

  _cancelPlayerStopIfScheduled(channelId: string) {
    if (channelId in this.terminators) {
      clearTimeout(this.terminators[channelId]);
      delete this.terminators[channelId];
      this.log('info', 'Player "%s" shutdown is cancelled', channelId);
    }
  }

  _stopAndRemovePlayer(channelId: string) {
    const player = this.players[channelId];
    this._removePlayer(channelId);
    player.stop();
  }

  countPlayers(): number {
    return Object.keys(this.players).length;
  }

  countClients(): number {
    return _.sumBy(
      Object.values(this.players),
      (p: Player) => p.countClients()
    );
  }

  toString(): string {
    return `container(${this.backend})`;
  }
}
