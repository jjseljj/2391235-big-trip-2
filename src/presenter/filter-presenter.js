import {render, remove} from '../framework/render.js';
import FiltersView from '../view/filters-view.js';
import {FilterType} from '../const.js';

export default class FilterPresenter {
  #container = null;
  #pointModel = null;
  #filterModel = null;
  #filterComponent = null;

  constructor({container, pointModel, filterModel}) {
    this.#container = container;
    this.#pointModel = pointModel;
    this.#filterModel = filterModel;

    this.#filterModel.addObserver(this.#handleModelChange);
  }

  init() {
    const filters = this.#getFilters();

    this.#filterComponent = new FiltersView({
      filters,
      onFilterChange: this.#handleFilterChange
    });

    render(this.#filterComponent, this.#container);
  }

  #getFilters() {
    const points = this.#pointModel.points;

    return [
      {
        type: FilterType.EVERYTHING,
        name: 'Everything',
        isChecked: this.#filterModel.filter === FilterType.EVERYTHING,
        isDisabled: false
      },
      {
        type: FilterType.FUTURE,
        name: 'Future',
        isChecked: this.#filterModel.filter === FilterType.FUTURE,
        isDisabled: !points.some((point) => new Date(point.dateFrom) > new Date())
      },
      {
        type: FilterType.PRESENT,
        name: 'Present',
        isChecked: this.#filterModel.filter === FilterType.PRESENT,
        isDisabled: !points.some((point) => {
          const now = new Date();
          return new Date(point.dateFrom) <= now && new Date(point.dateTo) >= now;
        })
      },
      {
        type: FilterType.PAST,
        name: 'Past',
        isChecked: this.#filterModel.filter === FilterType.PAST,
        isDisabled: !points.some((point) => new Date(point.dateTo) < new Date())
      }
    ];
  }

  #handleFilterChange = (filterType) => {
    this.#filterModel.setFilter(filterType);
  };

  #handleModelChange = () => {
    remove(this.#filterComponent);
    this.init();
  };
}
