import Logger from './logger';
import State from './state';

/**
 * Create and control a DOM element for a status bar tile.
 */
export default class StatusView {
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

    this.setState(State.PENDING);
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
   * @param  {Symbol}  state          The new state.
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

  /**
   * Show or hide the view depending on the given state by applying or removing
   * an inline `display: none` style.
   *
   * @param    {Symbol}  state  The new state.
   */
  _updateVisibility(state) {
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
}
