const childProcess = require('child_process');

const { AutoLanguageClient } = require('atom-languageclient');

const pkg = require('../package.json');
const State = require('./state');
const StatusBarTileView = require('./status-bar-tile-view');

class AtomRustPlugin extends AutoLanguageClient {
  constructor() {
    super();

    this.config = pkg.configSchema;
    this.state = null;
    this.statusTile = null;
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
    const dev = atom.config.get('atom-rust.dev');
    const command = atom.config.get('atom-rust.command').split(' ');
    const rlsRoot = process.env.RLS_ROOT;

    if (dev) {
      this.logger.debug('starting RLS via "cargo run --release" at RLS_ROOT');
      return childProcess.spawn('cargo', ['run', '--release'], { cwd: rlsRoot });
    } else {
      this.logger.debug(`starting RLS via "${command.join(' ')}"`);
      return childProcess.spawn(command.shift(), command);
    }
  }

  postInitialization() {
    this.setState(State.READY);
  }

  consumeStatusBar(statusBar) {
    if (this.statusTile) {
      this.statusTile.destroy();
      this.statusTile = null;
    }

    this.statusTile = statusBar.addLeftTile({
      item: this.statusView.element,
      priority: -100,
    });
  }

  setState(state) {
    this.state = state;
    this.statusView.setState(state);
  }
}

module.exports = new AtomRustPlugin();
