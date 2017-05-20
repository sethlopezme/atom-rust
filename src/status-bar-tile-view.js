// @flow
const State = require('./state');

module.exports = class StatusBarTileView {
  constructor() {
    this.title = document.createElement('span');
    this.title.textContent = 'RLS';

    this.icon = document.createElement('span');
    this.icon.classList.add('text-smaller', 'icon');

    this.element = document.createElement('status-bar-atom-rust');
    this.element.classList.add('inline-block');
    this.element.appendChild(this.title);
    this.element.appendChild(document.createTextNode(' '));
    this.element.appendChild(this.icon);

    this.updateView();
  }

  destroy() {
    this.element.remove();

    if (this.tooltip) {
      this.tooltip.dispose();
    }
  }

  updateView(state) {
    this.updateIcon(state);
    this.updateTooltip(state);
    this.updateVisibility(state);
  }

  updateIcon(state) {
    this.icon.classList.remove(
      'icon-check',
      'icon-repo-sync',
      'icon-x',
      'text-error',
      'text-success',
      'text-warning'
    );

    switch (state) {
      case State.ANALYZING:
        this.icon.classList.add('icon-repo-sync', 'text-warning');
        break;
      case State.READY:
        this.icon.classList.add('icon-check', 'text-success');
        break;
      case State.ERROR:
        this.icon.classList.add('icon-x', 'text-error');
        break;
      case State.PENDING:
      default:
        break;
    }
  }

  updateTooltip(state) {
    this.tooltip = atom.tooltips.add(this.element, {
      title() {
        let title = 'RLS: ';

        switch (state) {
          case State.ANALYZING:
            title += 'analyzing';
            break;
          case State.READY:
            title += 'ready';
            break;
          case State.ERROR:
            title += 'error';
            break;
          case State.PENDING:
          default:
            title = title.slice(0, 3);
            break;
        }

        return title;
      },
    });
  }

  updateVisibility(state) {
    switch (state) {
      case State.ANALYZING:
      case State.READY:
      case State.ERROR:
        this.element.style.display = '';
        break;
      case State.PENDING:
      default:
        this.element.style.display = 'none';
        break;
    }
  }

  setState(state) {
    this.updateView(state);
  }
};
