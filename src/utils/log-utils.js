// @flow

import { log } from 'winston';

export const module = (name: any) =>
  (level: string, message: string, ...any: any[]) =>
    log(level, `[${name}] ${message}`, ...any);

export default { module };
