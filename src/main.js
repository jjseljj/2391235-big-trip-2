import TripPresenter from './presenter/trip-presenter.js';
import PointModel from './model/point-model.js';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import NewEventButtonPresenter from './presenter/new-event-button-presenter.js';
import {tripControlsFiltersContainer, tripEventsContainer} from './const/dom-elements.js';
import ApiService from './api/api-service.js';

const apiService = new ApiService(
  'https://22.objects.htmlacademy.pro/big-trip',
  'Basic qwerty123456789'
);

const pointModel = new PointModel({apiService});
const filterModel = new FilterModel();

const filterPresenter = new FilterPresenter({
  container: tripControlsFiltersContainer,
  pointModel,
  filterModel
});

let newEventButtonPresenter = null;

const tripPresenter = new TripPresenter({
  tripEventsContainer,
  pointModel,
  filterModel,
  onNewPointDestroy: () => {
    newEventButtonPresenter.toggleDisabledState(false);
  }
});

newEventButtonPresenter = new NewEventButtonPresenter({
  container: tripControlsFiltersContainer,
  onClick: () => tripPresenter.createPoint()
});

newEventButtonPresenter.init();
filterPresenter.init();
tripPresenter.renderLoading();
pointModel.init().finally(() => {
  tripPresenter.init();
});
