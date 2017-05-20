// @flow
const which = require('which');

export async function getExecutablePath(executable) {
  return new Promise((resolve, reject) => {
    which(executable, (error, path) => (error ? reject(error) : resolve(path)));
  });
}

export async function isExecutableInPath(executable) {
  return new Promise(resolve => {
    which(executable, error => resolve(!error));
  });
}
