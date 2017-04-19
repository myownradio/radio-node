import * as EventEmitter from 'events';

export const proxy = (event: string, from: any, to: EventEmitter) => {
  from.on(event, (...args) => to.emit(event, ...args));
};

export default { proxy };
