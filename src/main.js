import TripPresenter from './presenter/trip-presenter.js';
import PointModel from './model/point-model.js';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import NewEventButtonPresenter from './presenter/new-event-button-presenter.js';
import {tripControlsFiltersContainer, tripEventsContainer, tripMainContainer} from './const/dom-elements.js';
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
  tripMainContainer,
  pointModel,
  filterModel,
  onNewPointDestroy: () => {
    newEventButtonPresenter.toggleDisabledState(false);
  }
});

newEventButtonPresenter = new NewEventButtonPresenter({
  container: tripMainContainer,
  onClick: () => {
    tripPresenter.createPoint();
    newEventButtonPresenter.toggleDisabledState(true);
  }
});

newEventButtonPresenter.init();
newEventButtonPresenter.toggleDisabledState(false);

filterPresenter.init();
tripPresenter.renderLoading();

pointModel.init().finally(() => {
  tripPresenter.init();
  newEventButtonPresenter.toggleDisabledState(false);
});
