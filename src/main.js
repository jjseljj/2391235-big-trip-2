import TripPresenter from './presenter/trip-presenter.js';
import PointModel from './model/point-model.js';

const tripControlsFiltersContainer = document.querySelector('.trip-controls__filters');
const tripEventsContainer = document.querySelector('.trip-events');

const tripEventsListContainer = document.createElement('ul');
tripEventsListContainer.classList.add('trip-events__list');

tripEventsContainer.append(tripEventsListContainer);

const pointModel = new PointModel();

const tripPresenter = new TripPresenter({
  tripControlsFiltersContainer,
  tripEventsContainer,
  tripEventsListContainer,
  pointModel
});

tripPresenter.init();
