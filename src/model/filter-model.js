import Observable from '../framework/observable.js';
import {UpdateType} from '../const.js';

export default class FilterModel extends Observable {
  #filter = 'everything';

  get filter() {
    return this.#filter;
  }

  setFilter(filter) {
    this.#filter = filter;
    this._notify(UpdateType.MAJOR);
  }
}
