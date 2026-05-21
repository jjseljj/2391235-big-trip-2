import AbstractView from '../framework/view/abstract-view.js';

function createFilterItemTemplate(filter) {
  return `
    <div class="trip-filters__filter">
      <input
        id="filter-${filter.type}"
        class="trip-filters__filter-input visually-hidden"
        type="radio"
        name="trip-filter"
        value="${filter.type}"
        ${filter.isChecked ? 'checked' : ''}
        ${filter.isDisabled ? 'disabled' : ''}
      >
      <label class="trip-filters__filter-label" for="filter-${filter.type}">
        ${filter.name}
      </label>
    </div>
  `;
}

function createFiltersTemplate(filters) {
  const filtersTemplate = filters
    .map((filter) => createFilterItemTemplate(filter))
    .join('');

  return `
    <form class="trip-filters" action="#" method="get">
      ${filtersTemplate}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>
  `;
}
export default class FiltersView extends AbstractView {
  #filters = null;
  #onFilterChange = null;

  constructor({filters, onFilterChange}) {
    super();
    this.#filters = filters;
    this.#onFilterChange = onFilterChange;

    this.element.addEventListener('change', this.#filterTypeChangeHandler);
  }

  get template() {
    return createFiltersTemplate(this.#filters);
  }

  #filterTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this.#onFilterChange(evt.target.value);
  };
}
