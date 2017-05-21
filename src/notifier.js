const defaults = {
  dismissable: true,
  packageName: 'atom-rust',
};

/**
 * Display an error notification to the user with a button to create an issue.
 *
 * @param   {string}  title         The title of the notification.
 * @param   {Object}  [options={}]  Notification options.
 */
function error(title, options = {}) {
  let config;

  if (options instanceof Error) {
    config = Object.assign({}, defaults, {
      detail: options.message,
      stack: options.stack,
    });
  } else {
    config = Object.assign({}, defaults, options);
  }

  return atom.notifications.addFatalError(title, config);
}

/**
 * Display a normal notification to the user.
 *
 * @param   {string}  title         The title of the notification.
 * @param   {Object}  [options={}]  Notification options.
 */
function info(title, options = {}) {
  let config = Object.assign({}, defaults, options);
  return atom.notifications.addInfo(title, config);
}

/**
 * Display a success notification to the user.
 *
 * @param   {string}  title         The title of the notification.
 * @param   {Object}  [options={}]  Notitication options.
 */
function success(title, options = {}) {
  let config = Object.assign({}, defaults, options);
  return atom.notifications.addSuccess(title, config);
}

/**
 * Display a warning notification to the user.
 *
 * @param   {string}  title         The title of the notitication.
 * @param   {Object}  [options={}]  Notification options.
 */
function warning(title, options = {}) {
  let config = Object.assign({}, defaults, options);
  return atom.notifications.addWarning(title, config);
}

export default {
  error,
  info,
  success,
  warning,
};
