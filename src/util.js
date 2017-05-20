import Which from 'which';

/**
 * Retrieve the path of an executable.
 *
 * @param   {string}  executable  The name of the executable.
 * @return  {Promise<string>}     The path of the executable.
 */
export async function getExecutablePath(executable) {
  return new Promise((resolve, reject) => {
    Which(executable, (error, path) => (error ? reject(error) : resolve(path)));
  });
}

/**
 * Test whether an executable is available to be called.
 *
 * @param   {string}   executable  The name of the executable.
 * @return  {Promise<boolean>}     Whether or not the executable is available.
 */
export async function isExecutableAvailable(executable) {
  return new Promise(resolve => {
    Which(executable, error => resolve(!error));
  });
}

export default {
  getExecutablePath,
  isExecutableAvailable,
};
