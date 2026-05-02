import {render, RenderPosition, remove} from '../framework/render.js';
import SortView from '../view/sort-view.js';
import EmptyPointListView from '../view/empty-point-list-view.js';
import PointPresenter from './point-presenter.js';
import {FilterType, SortType, UserAction} from '../const.js';

const filterConfig = {
  [FilterType.EVERYTHING]: {
    name: 'Everything',
    check: () => true
  },
  [FilterType.FUTURE]: {
    name: 'Future',
    check: isFuturePoint
  },
  [FilterType.PRESENT]: {
    name: 'Present',
    check: isPresentPoint
  },
  [FilterType.PAST]: {
    name: 'Past',
    check: isPastPoint
  }
};

const emptyListMessages = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.FUTURE]: 'There are no future events now',
  [FilterType.PRESENT]: 'There are no present events now',
  [FilterType.PAST]: 'There are no past events now'
};

function isFuturePoint(point) {
  const now = new Date();
  return new Date(point.dateFrom) > now;
}

function isPresentPoint(point) {
  const now = new Date();
  const dateFrom = new Date(point.dateFrom);
  const dateTo = new Date(point.dateTo);

  return dateFrom <= now && dateTo >= now;
}

function isPastPoint(point) {
  const now = new Date();
  return new Date(point.dateTo) < now;
}

function sortPointByDay(pointA, pointB) {
  return new Date(pointA.dateFrom) - new Date(pointB.dateFrom);
}

function sortPointByTime(pointA, pointB) {
  const durationA = new Date(pointA.dateTo) - new Date(pointA.dateFrom);
  const durationB = new Date(pointB.dateTo) - new Date(pointB.dateFrom);

  return durationB - durationA;
}

export default class TripPresenter {
  #tripEventsContainer = null;
  #tripEventsListContainer = null;
  #pointModel = null;
  #filterModel = null;
  #pointPresenters = new Map();
  #currentSortType = SortType.DAY;
  #sortComponent = null;
  #emptyComponent = null;
  #onNewPointDestroy = null;

  constructor({tripEventsContainer, tripEventsListContainer, pointModel, filterModel, onNewPointDestroy}) {
    this.#tripEventsContainer = tripEventsContainer;
    this.#tripEventsListContainer = tripEventsListContainer;
    this.#pointModel = pointModel;
    this.#filterModel = filterModel;
    this.#filterModel.addObserver(this.#handleFilterChange);
    this.#onNewPointDestroy = onNewPointDestroy;
  }

  #createPointForView(point) {
    const destination = this.#pointModel.destinations.find((item) => item.id === point.destinationId) || {
      id: null,
      name: '',
      description: '',
      pictures: []
    };

    const offersByType = this.#pointModel.offers.find((item) => item.type === point.type);
    const availableOffers = offersByType?.offers || [];

    const offers = availableOffers.map((offer) => ({
      ...offer,
      isChecked: point.offerIds.includes(offer.id)
    }));

    return {
      id: point.id,
      type: point.type,
      destination,
      dateFrom: point.dateFrom,
      dateTo: point.dateTo,
      basePrice: point.basePrice,
      isFavorite: point.isFavorite,
      offers
    };
  }

  init() {
    if (this.#points.length === 0) {
      const filterType = this.#filterModel.filter;

      this.#emptyComponent = new EmptyPointListView({
        message: emptyListMessages[filterType]
      });

      render(this.#emptyComponent, this.#tripEventsListContainer);
      return;
    }

    this.#sortComponent = new SortView({
      currentSortType: this.#currentSortType,
      onSortTypeChange: this.#handleSortTypeChange
    });

    render(this.#sortComponent, this.#tripEventsContainer, RenderPosition.AFTERBEGIN);
    this.#renderPoints();
  }

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #renderPoints() {
    const sortedPoints = [...this.#points];

    switch (this.#currentSortType) {
      case SortType.TIME:
        sortedPoints.sort(sortPointByTime);
        break;
      case SortType.PRICE:
        sortedPoints.sort((pointA, pointB) => pointB.basePrice - pointA.basePrice);
        break;
      case SortType.DAY:
        sortedPoints.sort(sortPointByDay);
        break;
    }

    sortedPoints.forEach((point) => {
      const pointForView = this.#createPointForView(point);

      const pointPresenter = new PointPresenter({
        container: this.#tripEventsListContainer,
        destinations: this.#pointModel.destinations,
        offersByType: this.#pointModel.offers,
        onModeChange: this.#handleModeChange,
        onDataChange: this.#handlePointChange
      });

      pointPresenter.init(pointForView);
      this.#pointPresenters.set(point.id, pointPresenter);
    });
  }

  #createPointFromView(updatedPoint) {
    return {
      id: updatedPoint.id,
      type: updatedPoint.type,
      dateFrom: updatedPoint.dateFrom,
      dateTo: updatedPoint.dateTo,
      basePrice: updatedPoint.basePrice,
      isFavorite: updatedPoint.isFavorite,
      destinationId: updatedPoint.destination.id,
      offerIds: updatedPoint.offers
        .filter((offer) => offer.isChecked)
        .map((offer) => offer.id)
    };
  }

  #handlePointChange = (userAction, updatedPoint) => {
    switch (userAction) {
      case UserAction.ADD_POINT: {
        this.#onNewPointDestroy?.();
        const nextPoint = this.#createPointFromView({
          ...updatedPoint,
          id: crypto.randomUUID()
        });

        this.#pointModel.addPoint(nextPoint);
        this.#handleFilterChange();
        break;
      }
      case UserAction.UPDATE_POINT: {
        const nextPoint = this.#createPointFromView(updatedPoint);

        this.#pointModel.updatePoint(nextPoint);

        const pointForView = this.#createPointForView(nextPoint);
        this.#pointPresenters.get(nextPoint.id).init(pointForView);
        break;
      }

      case UserAction.DELETE_POINT:
        this.#pointModel.deletePoint(updatedPoint.id);
        this.#handleFilterChange();
        break;
    }
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearPoints();
    this.#renderPoints();
  };

  #clearPoints() {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
  }

  #clearPointList() {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();

    if (this.#sortComponent) {
      remove(this.#sortComponent);
      this.#sortComponent = null;
    }
  }

  get #points() {
    const filterType = this.#filterModel.filter;
    const points = this.#pointModel.points;

    return points.filter(filterConfig[filterType].check);
  }

  #handleFilterChange = () => {
    this.#currentSortType = SortType.DAY;
    this.#clearPointList();
    this.#clearEmptyList();

    /*if (this.#sortComponent) {
      this.#sortComponent.removeElement();
      this.#sortComponent = null;
    }*/

    if (this.#points.length === 0) {
      const filterType = this.#filterModel.filter;

      this.#emptyComponent = new EmptyPointListView({
        message: emptyListMessages[filterType]
      });

      render(this.#emptyComponent, this.#tripEventsListContainer);
      return;
    }

    this.#sortComponent = new SortView({
      currentSortType: this.#currentSortType,
      onSortTypeChange: this.#handleSortTypeChange
    });

    render(this.#sortComponent, this.#tripEventsContainer, RenderPosition.AFTERBEGIN);

    this.#renderPoints();
  };

  #clearEmptyList() {
    if (this.#emptyComponent) {
      this.#emptyComponent.removeElement();
      this.#emptyComponent = null;
    }
  }

  createPoint() {
    this.#handleModeChange();

    this.#filterModel.setFilter(FilterType.EVERYTHING);

    this.#currentSortType = SortType.DAY;
    this.#clearPointList();
    this.#clearEmptyList();

    const newPointPresenter = new PointPresenter({
      container: this.#tripEventsListContainer,
      destinations: this.#pointModel.destinations,
      offersByType: this.#pointModel.offers,
      onModeChange: this.#handleModeChange,
      onDataChange: this.#handlePointChange,
      onDestroy: this.#onNewPointDestroy
    });

    newPointPresenter.init({
      id: null,
      type: 'flight',
      destination: {
        id: null,
        name: '',
        description: '',
        pictures: []
      },
      dateFrom: new Date(),
      dateTo: new Date(),
      basePrice: 0,
      isFavorite: false,
      offers: []
    });

    /*this.#onNewPointDestroy?.();*/
  }
}
