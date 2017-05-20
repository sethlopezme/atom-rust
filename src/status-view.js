/**
 * Creates and controls the DOM element for a status bar tile.
 */
export default class StatusView {
  /**
   * Static symbols representing each state of the StatusView.
   *
   * @type  {Object}
   */
  static get State() {
    return {
      ANALYZING: Symbol(),
      ERROR: Symbol(),
      PENDING: Symbol(),
      READY: Symbol(),
    };
  }

  /**
   * Create an instance of StatusView and initialize its state.
   */
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

    this.setState(StatusView.State.PENDING);
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
   * @param  {string}  customMessage  A custom message displayed in the tooltip.
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
      case StatusView.State.ANALYZING:
        this.icon.classList.add('icon-repo-sync', 'text-warning');
        break;
      case StatusView.State.READY:
        this.icon.classList.add('icon-check', 'text-success');
        break;
      case StatusView.State.ERROR:
        this.icon.classList.add('icon-x', 'text-error');
        break;
      case StatusView.State.PENDING:
      default:
        break;
    }
  }

  /**
   * Create and attach a new tooltip to the view for the given state and
   * custom message.
   *
   * @param    {Symbol}  state          The new state.
   * @param    {string}  customMessage  An optional custom message.
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
          case StatusView.State.ANALYZING:
            title += 'analyzing';
            break;
          case StatusView.State.READY:
            title += 'ready';
            break;
          case StatusView.State.ERROR:
            title += 'error';
            break;
          case StatusView.State.PENDING:
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
      case StatusView.State.ANALYZING:
      case StatusView.State.READY:
      case StatusView.State.ERROR:
        this.element.style.display = '';
        break;
      case StatusView.State.PENDING:
      default:
        this.element.style.display = 'none';
        break;
    }
  }
}
