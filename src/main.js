import TripPresenter from './presenter/trip-presenter.js';
import PointModel from './model/point-model.js';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import ApiService from './api/api-service.js';

const tripInfoContainer = document.querySelector('.trip-main__trip-info');
const tripControlsFiltersContainer = document.querySelector('.trip-controls__filters');
const tripEventsContainer = document.querySelector('.trip-events');
const tripMainContainer = document.querySelector('.trip-main');

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

const tripPresenter = new TripPresenter({
  tripInfoContainer,
  tripEventsContainer,
  tripMainContainer,
  pointModel,
  filterModel
});

filterPresenter.init();
tripPresenter.renderLoading();

pointModel.init().finally(() => {
  tripPresenter.init();
});
