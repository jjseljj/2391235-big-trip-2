import TripPresenter from './presenter/trip-presenter.js';

/**
 * Main
 * Точка входа в приложение
 *
 * Отвечает за:
 * - получение контейнеров из DOM
 * - создание списка событий (ul)
 * - инициализацию TripPresenter
 *
 * Запускает отрисовку всех компонентов страницы
 */

const tripControlsFiltersContainer = document.querySelector('.trip-controls__filters');
const tripEventsContainer = document.querySelector('.trip-events');

const tripEventsListContainer = document.createElement('ul');
tripEventsListContainer.classList.add('trip-events__list');

tripEventsContainer.append(tripEventsListContainer);

const tripPresenter = new TripPresenter({
  tripControlsFiltersContainer,
  tripEventsContainer,
  tripEventsListContainer
});

tripPresenter.init();
