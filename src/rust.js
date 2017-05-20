import ChildProcess from 'child_process';

import Logger from './logger';
import Util from './util';

/**
 * Test if the rustup executable is available.
 *
 * @return  {Promise<boolean>}  Whether or not rustup is available.
 */
export async function isRustupInstalled() {
  return await Util.isExecutableInPath('rustup');
}

/**
 * Test if the rustc executable is managed by rustup.
 *
 * @param   {string}   rustcSysRoot  Path of the rustc installation.
 * @return  {boolean}                Whether or not rustc is managed by rustup.
 */
export function isManagedByRustup(rustcSysRoot) {
  const rustupHome = process.env.RUSTUP_HOME;

  if (rustupHome) {
    return !!~rustupHome.indexOf(rustcSysRoot);
  }

  return rustcSysRoot.indexOf('.rustup') >= 0;
}

/**
 * Retrieve the path of the rustc installation.
 *
 * @return  {Promise<string>}  Path of the rustc installation.
 */
function getRustcSysRoot() {
  return new Promise((resolve, reject) => {
    ChildProcess.exec('rustc --print sysroot', (error, stdout) => {
      if (error) {
        Logger.error(stdout, error);
        return reject(error);
      }

      return resolve(stdout);
    });
  });
}

/**
 * Spawn an RLS instance using the settings for this package.
 *
 * @return  {ChildProcess}  The process of the RLS instance.
 */
export function spawnRls() {
  const [command, ...args] = atom.config.get('atom-rust.command').split(' ');
  const options = {
    cwd: atom.config.get('atom-rust.useRlsRoot') ? process.env.RLS_ROOT : void 0,
  };
  return ChildProcess.spawn(command, args, options);
}

export default {
  isRustupInstalled,
  isManagedByRustup,
  spawnRls,
};
