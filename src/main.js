import TripPresenter from './presenter/trip-presenter.js';
import PointModel from './model/point-model.js';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenter/filter-presenter.js';

const tripControlsFiltersContainer = document.querySelector('.trip-controls__filters');
const tripEventsContainer = document.querySelector('.trip-events');

const tripEventsListContainer = document.createElement('ul');
tripEventsListContainer.classList.add('trip-events__list');

tripEventsContainer.append(tripEventsListContainer);

const pointModel = new PointModel();

const filterModel = new FilterModel();

const filterPresenter = new FilterPresenter({
  container: tripControlsFiltersContainer,
  pointModel,
  filterModel
});

const newEventButton = document.querySelector('.trip-main__event-add-btn');

const tripPresenter = new TripPresenter({
  tripEventsContainer,
  tripEventsListContainer,
  pointModel,
  filterModel,
  onNewPointDestroy: () => {
    newEventButton.disabled = false;
  }
});

newEventButton.addEventListener('click', () => {
  tripPresenter.createPoint();
  newEventButton.disabled = true;
});

filterPresenter.init();
tripPresenter.init();
