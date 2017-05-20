import { AutoLanguageClient } from 'atom-languageclient';

const Rust = require('./rust');
const StatusBarTileView = require('./status-bar-tile-view');
const pkg = require('../package.json');

class AtomRustPlugin extends AutoLanguageClient {
  constructor() {
    super();
    this.config = pkg.configSchema;
    this.statusView = new StatusBarTileView();
  }

  activate() {
    this.statusView.setState(StatusBarTileView.State.PENDING);
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
    rls.on('error', error => this.onServerStartError(error));
    return rls;
  }

  preInitialization(connection) {
    connection.onCustom('rustDocument/diagnosticsBegin', () => {
      this.statusView.setState(StatusBarTileView.State.ANALYZING);
    });
    connection.onCustom('rustDocument/diagnosticsEnd', () => {
      this.statusView.setState(StatusBarTileView.State.READY);
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

  onServerStartError(error) {
    console.error(error);
    this.statusView.setState(StatusBarTileView.State.ERROR);
    atom.notifications.addFatalError('Could not spawn RLS process', {
      description: error.message,
    });
  }
}

module.exports = new AtomRustPlugin();
