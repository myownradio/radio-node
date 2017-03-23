// @flow

import { which } from 'shelljs';

const locate = (cmd: string): Promise<string> => {
  return new Promise((resolve, fail) => {
    const foundCmd = which(cmd);
    if (foundCmd !== null) {
      resolve(foundCmd.stdout);
    } else {
      fail(`Command ${cmd} not found.`);
    }
  });
};

export default locate;
