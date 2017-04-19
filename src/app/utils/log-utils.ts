import { Logger, transports } from 'winston';

const logger = new Logger({
  transports: [
    new transports.Console({ timestamp: true }),
  ],
});

export const module = (name: any) =>
  (level: string, message: string, ...any: any[]) =>
    logger.log(level, `[${name}] ${message}`, ...any);

export default { module };
