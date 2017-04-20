import * as _ from 'lodash';

import { module } from '../utils/log-utils';
import Player from './player';
import Timer = NodeJS.Timer;
import { BackendService } from "../service/backend";

const PLAYER_IDLE_TIMEOUT: number = 10000;

export default class Container {
  backendService: BackendService;
  players: { [key: string]: Player } = {};
  terminators: { [key: string]: Timer } = {};
  log = module(this);

  constructor(backendService: BackendService) {
    this.backendService = backendService;
    this.log('info', 'Initialized');
  }

  createOrGetPlayer(channelId: string): Player {
    if (!(channelId in this.players)) {
      this.log('info', 'Create player for channel "%s"', channelId);
      this.players[channelId] = this.createPlayer(channelId);
      this.bindPlayerEvents(this.players[channelId]);
    } else {
      this.log('info', 'Attach to player for channel "%s"', channelId);
    }
    return this.players[channelId];
  }

  private bindPlayerEvents(player: Player) {
    const channelId = player.channelId;
    player.on('new', () => this.cancelPlayerStopIfScheduled(channelId));
    player.on('idle', () => this.schedulePlayerStop(channelId));
  }

  private createPlayer(channelId: string): Player {
    return new Player(this.backendService, channelId);
  }

  private removePlayer(channelId: string) {
    this.log('info', 'Delete player "%s" from container', channelId);
    delete this.players[channelId];
  }

  private schedulePlayerStop(channelId: string) {
    this.terminators[channelId] = setTimeout(
      this.stopAndRemovePlayer.bind(this),
      PLAYER_IDLE_TIMEOUT,
      channelId,
    );
    this.log('info', 'Player "%s" is scheduled to shutdown', channelId);
  }

  private cancelPlayerStopIfScheduled(channelId: string) {
    if (channelId in this.terminators) {
      clearTimeout(this.terminators[channelId]);
      delete this.terminators[channelId];
      this.log('info', 'Player "%s" shutdown is cancelled', channelId);
    }
  }

  private stopAndRemovePlayer(channelId: string) {
    const player = this.players[channelId];
    this.removePlayer(channelId);
    player.stop();
  }

  countPlayers(): number {
    return Object.keys(this.players).length;
  }

  countClients(): number {
    return _.sumBy(
      Object.values(this.players),
      (p: Player) => p.countClients(),
    );
  }

  toString(): string {
    return `container(${this.backendService.name})`;
  }
}
