import Observable from '../framework/observable.js';

export default class FilterModel extends Observable {
  #filter = 'everything';

  get filter() {
    return this.#filter;
  }

  setFilter(filter) {
    this.#filter = filter;
    this._notify();
  }
}
