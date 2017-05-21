const defaults = {
  dismissable: true,
  packageName: 'atom-rust',
};

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

  atom.notifications.addFatalError(title, config);
}

function info(title, options = {}) {
  let config = Object.assign({}, defaults, options);
  atom.notifications.addInfo(title, config);
}

function success(title, options = {}) {
  let config = Object.assign({}, defaults, options);
  atom.notifications.addSuccess(title, config);
}

function warning(title, options = {}) {
  let config = Object.assign({}, defaults, options);
  atom.notifications.addWarning(title, config);
}

export default {
  error,
  info,
  success,
  warning,
};
