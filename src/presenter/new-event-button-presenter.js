import {render, remove, RenderPosition} from '../framework/render.js';
import NewEventButtonView from '../view/new-event-button-view.js';

export default class NewEventButtonPresenter {
  #container = null;
  #buttonComponent = null;
  #onClick = null;

  constructor({container, onClick}) {
    this.#container = container;
    this.#onClick = onClick;
  }

  init() {
    this.#buttonComponent = new NewEventButtonView({
      onClick: this.#handleClick
    });

    render(this.#buttonComponent, this.#container, RenderPosition.BEFOREEND);
  }

  destroy() {
    remove(this.#buttonComponent);
  }

  toggleDisabledState(disabled) {
    this.#buttonComponent.toggleDisabledState(disabled);
  }

  #handleClick = () => {
    this.#onClick();
  };
}
