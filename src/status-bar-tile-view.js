/**
 * Creates and controls the DOM element for the status bar tile.
 */
export default class StatusBarTileView {
  static get State() {
    return {
      ANALYZING: Symbol(),
      ERROR: Symbol(),
      PENDING: Symbol(),
      READY: Symbol(),
    };
  }

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

    this.setState(StatusBarTileView.State.PENDING);
  }

  /**
   * Remove the view from the DOM.
   */
  destroy() {
    this.element.remove();

    if (this.tooltip) {
      this.tooltip.dispose();
    }
  }

  /**
   * Update the view to display the given state.
   *
   * @param  {Symbol}  state          The new state..
   * @param  {String}  customMessage  A custom message displayed in the tooltip.
   */
  setState(state, customMessage) {
    this._updateIcon(state);
    this._updateTooltip(state, customMessage);
    this._updateVisibility(state);
  }

  /**
   * Update the view with the appropriate icon for the given state.
   *
   * @param    {Symbol}  state  The new state.
   */
  _updateIcon(state) {
    this.icon.classList.remove(
      'icon-check',
      'icon-repo-sync',
      'icon-x',
      'text-error',
      'text-success',
      'text-warning'
    );

    switch (state) {
      case StatusBarTileView.State.ANALYZING:
        this.icon.classList.add('icon-repo-sync', 'text-warning');
        break;
      case StatusBarTileView.State.READY:
        this.icon.classList.add('icon-check', 'text-success');
        break;
      case StatusBarTileView.State.ERROR:
        this.icon.classList.add('icon-x', 'text-error');
        break;
      case StatusBarTileView.State.PENDING:
      default:
        break;
    }
  }

  /**
   * Create and attach a new tooltip to the view for the given state and
   * custom message.
   *
   * @param    {Symbol}  state          The new state.
   * @param    {String}  customMessage  An optional custom message.
   */
  _updateTooltip(state, customMessage) {
    if (this.tooltip) {
      this.tooltip.dispose();
    }

    this.tooltip = atom.tooltips.add(this.element, {
      title() {
        let title = 'RLS: ';

        // if a custom message is supplied, return early with it
        if (customMessage) {
          return title + customMessage;
        }

        // set a default message based on the state
        switch (state) {
          case StatusBarTileView.State.ANALYZING:
            title += 'analyzing';
            break;
          case StatusBarTileView.State.READY:
            title += 'ready';
            break;
          case StatusBarTileView.State.ERROR:
            title += 'error';
            break;
          case StatusBarTileView.State.PENDING:
          default:
            title = title.slice(0, 3);
            break;
        }

        return title;
      },
    });
  }

  /**
   * Show or hide the view depending on the given state by applying or removing
   * an inline `display: none` style.
   * 
   * @param    {Symbol}  state  The new state.
   */
  _updateVisibility(state) {
    switch (state) {
      case StatusBarTileView.State.ANALYZING:
      case StatusBarTileView.State.READY:
      case StatusBarTileView.State.ERROR:
        this.element.style.display = '';
        break;
      case StatusBarTileView.State.PENDING:
      default:
        this.element.style.display = 'none';
        break;
    }
  }
}
