import {createElement} from '../render.js';

/**
 * Abstract View
 * Базовый класс для всех View компонентов
 *
 * Отвечает за:
 * - создание DOM-элемента из шаблона
 * - кеширование элемента (чтобы не пересоздавался)
 * - удаление элемента
 *
 * Используется как родительский класс для всех View:
 * FiltersView, SortView, PointView и т.д.
 */

export default class AbstractView {
  #element = null;

  get template() {
    throw new Error('Abstract method not implemented: get template');
  }

  getElement() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}
