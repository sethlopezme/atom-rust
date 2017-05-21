import { AutoLanguageClient } from 'atom-languageclient';

import Logger from './logger';
import Notifier from './notifier';
import Rust from './rust';
import State from './state';
import StatusView from './status-view';

const pkg = require('../package.json');

class AtomRustPlugin extends AutoLanguageClient {
  constructor() {
    super();
    this.config = pkg.configSchema;
    this.statusView = new StatusView();
    Logger.setDebug(atom.config.get('atom-rust.debug'));
  }

  activate() {
    this.statusView.setState(State.PENDING);
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
    const rls = Rust.spawnRls();
    rls.on('error', error => this.onStartServerProcessError(error));
    return rls;
  }

  preInitialization(connection) {
    connection.onCustom('rustDocument/diagnosticsBegin', () => {
      this.statusView.setState(State.ANALYZING);
    });
    connection.onCustom('rustDocument/diagnosticsEnd', () => {
      this.statusView.setState(State.READY);
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

  onStartServerProcessError(error) {
    this.statusView.setState(State.ERROR);
    Notifier.error('Could not spawn RLS process', error);
  }
}

module.exports = new AtomRustPlugin();
