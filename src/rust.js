const childProcess = require('child_process');

const util = require('./util');

async function isRustupInstalled() {
  return await util.isExecutableInPath('rustup');
}

function isManagedByRustup(rustcSysRoot) {
  const rustupHome = process.env.RUSTUP_HOME;

  if (rustupHome) {
    return !!~rustupHome.indexOf(rustcSysRoot);
  }

  return rustcSysRoot.indexOf('.rustup') >= 0;
}

function getRustcSysRoot() {
  return new Promise((resolve, reject) => {
    childProcess.exec('rustc --print sysroot', (error, stdout) => {
      if (error) {
        console.error(error);
        return reject(error);
      }

      return resolve(stdout);
    });
  });
}

function spawnRls() {
  const [command, ...args] = atom.config.get('atom-rust.command').split(' ');
  const options = {
    cwd: atom.config.get('atom-rust.useRlsRoot') ? process.env.RLS_ROOT : void 0,
  };
  return childProcess.spawn(command, args, options);
}

module.exports = {
  isRustupInstalled,
  isManagedByRustup,
  spawnRls,
};
