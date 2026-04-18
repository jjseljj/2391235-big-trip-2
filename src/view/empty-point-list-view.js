import AbstractView from '../framework/view/abstract-view.js';

function createEmptyPointListTemplate(message) {
  return `<p class="trip-events__msg">${message}</p>`;
}

export default class EmptyPointListView extends AbstractView {
  #message = '';

  constructor({message}) {
    super();
    this.#message = message;
  }

  get template() {
    return createEmptyPointListTemplate(this.#message);
  }
}
