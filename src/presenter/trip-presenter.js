import {render, RenderPosition} from '../framework/render.js';
import FiltersView from '../view/filters-view.js';
import SortView from '../view/sort-view.js';
import EmptyPointListView from '../view/empty-point-list-view.js';
import PointPresenter from './point-presenter.js';

const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past'
};

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
export default class TripPresenter {
  #tripControlsFiltersContainer = null;
  #tripEventsContainer = null;
  #tripEventsListContainer = null;
  #pointModel = null;
  #points = [];
  #pointPresenters = new Map();
  #emptyPointListComponent = new EmptyPointListView({
    message: 'Click New Event to create your first point'
  });

  constructor({tripControlsFiltersContainer, tripEventsContainer, tripEventsListContainer, pointModel}) {
    this.#tripControlsFiltersContainer = tripControlsFiltersContainer;
    this.#tripEventsContainer = tripEventsContainer;
    this.#tripEventsListContainer = tripEventsListContainer;
    this.#pointModel = pointModel;
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

  #createFilters(points) {
    return Object.entries(filterConfig).map(([type, {name, check}]) => ({
      type,
      name,
      isDisabled: type !== FilterType.EVERYTHING
        ? !points.some(check)
        : false,
      isChecked: type === FilterType.EVERYTHING
    }));
  }

  init() {
    this.#points = [...this.#pointModel.points];

    const filters = this.#createFilters(this.#points);
    render(new FiltersView({filters}), this.#tripControlsFiltersContainer);

    if (this.#points.length === 0) {
      render(this.#emptyPointListComponent, this.#tripEventsListContainer);
      return;
    }

    render(new SortView(), this.#tripEventsContainer, RenderPosition.AFTERBEGIN);
    this.#renderPoints();
  }

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #renderPoints() {
    this.#points.forEach((point) => {
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

  #handlePointChange = (updatedPoint) => {
    const nextPoint = this.#createPointFromView(updatedPoint);

    this.#points = this.#points.map((point) =>
      point.id === nextPoint.id ? nextPoint : point
    );

    const pointForView = this.#createPointForView(nextPoint);
    this.#pointPresenters.get(nextPoint.id).init(pointForView);
  };
}
