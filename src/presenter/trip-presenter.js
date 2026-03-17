import {render, RenderPosition} from '../render.js';
import FiltersView from '../view/filters-view.js';
import SortView from '../view/sort-view.js';
import PointView from '../view/point-view.js';
import EditPointView from '../view/edit-point-view.js';
import NewPointView from '../view/new-point-view.js';

/**
 * Trip Presenter
 * Презентер страницы маршрута (Trip)
 *
 * Отвечает за:
 * - инициализацию и отрисовку всех View компонентов
 * - управление расположением компонентов на странице
 *
 * Рендерит:
 * - FiltersView (фильтры)
 * - SortView (сортировка)
 * - NewPointView (форма создания)
 * - EditPointView (форма редактирования)
 * - PointView (карточки событий)
 *
 * Использует функцию render() для вставки элементов в DOM
 */

export default class TripPresenter {
  #tripControlsFiltersContainer = null;
  #tripEventsContainer = null;
  #tripEventsListContainer = null;

  constructor({tripControlsFiltersContainer, tripEventsContainer, tripEventsListContainer}) {
    this.#tripControlsFiltersContainer = tripControlsFiltersContainer;
    this.#tripEventsContainer = tripEventsContainer;
    this.#tripEventsListContainer = tripEventsListContainer;
  }

  init() {
    render(new FiltersView(), this.#tripControlsFiltersContainer);
    render(new SortView(), this.#tripEventsContainer, RenderPosition.AFTERBEGIN);
    render(new NewPointView(), this.#tripEventsListContainer, RenderPosition.AFTERBEGIN);
    render(new EditPointView(), this.#tripEventsListContainer, RenderPosition.AFTERBEGIN);
    render(new PointView(), this.#tripEventsListContainer);
    render(new PointView(), this.#tripEventsListContainer);
    render(new PointView(), this.#tripEventsListContainer);
  }
}
