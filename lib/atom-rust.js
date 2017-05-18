const childProcess = require('child_process');

const { AutoLanguageClient } = require('atom-languageclient');

const pkg = require('../package.json');
const State = require('./state');
const StatusBarTileView = require('./status-bar-tile-view');

class AtomRustPlugin extends AutoLanguageClient {
  constructor() {
    super();
    this.config = pkg.configSchema;
    this.statusView = new StatusBarTileView();
  }

  activate() {
    this.setState(State.PENDING);
    super.activate();
  }

  deactivate() {
    if (this.statusTile) {
      this.statusTile.destroy();
      this.statusTile = null;
    }

    super.deactivate();
  }

  getGrammarScopes() {
    return ['source.rust'];
  }

  getLanguageName() {
    return 'Rust';
  }

  getServerName() {
    return 'Rust Language Server';
  }

  startServerProcess() {
    const commandArgs = atom.config.get('atom-rust.command').split(' ');
    const useRlsRoot = atom.config.get('atom-rust.useRlsRoot');
    const commandConfig = {};
    // const rlsRoot = process.env.RLS_ROOT;

    if (useRlsRoot) {
      this.logger.debug('useRlsRoot');
      commandConfig.cwd = process.env.RLS_ROOT;
    }

    return childProcess.spawn(commandArgs.shift(), commandArgs);
  }

  preInitialization(connection) {
    connection.onCustom('rustDocument/diagnosticsBegin', () => {
      this.setState(State.ANALYZING);
    });
    connection.onCustom('rustDocument/diagnosticsEnd', () => {
      this.setState(State.READY);
    });
  }

  consumeStatusBar(statusBar) {
    if (this.statusTile) {
      this.statusTile.destroy();
      this.statusTile = null;
    }

    this.statusTile = statusBar.addLeftTile({
      item: this.statusView.element,
    });
  }

  setState(state) {
    this.state = state;
    this.statusView.setState(state);
  }
}

module.exports = new AtomRustPlugin();
