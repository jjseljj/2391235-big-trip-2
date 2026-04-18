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
      name: '',
      description: '',
      pictures: []
    };

    const offersByType = this.#pointModel.offers.find((item) => item.type === point.type);
    const availableOffers = offersByType ? offersByType.offers : [];

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
    return [
      {
        type: FilterType.EVERYTHING,
        name: 'Everything',
        isDisabled: false,
        isChecked: true
      },
      {
        type: FilterType.FUTURE,
        name: 'Future',
        isDisabled: !points.some(isFuturePoint),
        isChecked: false
      },
      {
        type: FilterType.PRESENT,
        name: 'Present',
        isDisabled: !points.some(isPresentPoint),
        isChecked: false
      },
      {
        type: FilterType.PAST,
        name: 'Past',
        isDisabled: !points.some(isPastPoint),
        isChecked: false
      }
    ];
  }

  init() {
    const filters = this.#createFilters(this.#pointModel.points);
    render(new FiltersView({filters}), this.#tripControlsFiltersContainer);

    if (this.#pointModel.points.length === 0) {
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
    this.#pointModel.points.forEach((point) => {
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

  #handlePointChange = (updatedPoint) => {
    this.#pointModel.points = this.#pointModel.points.map((point) =>
      point.id === updatedPoint.id ? {
        ...point,
        type: updatedPoint.type,
        dateFrom: updatedPoint.dateFrom,
        dateTo: updatedPoint.dateTo,
        basePrice: updatedPoint.basePrice,
        isFavorite: updatedPoint.isFavorite,
        offerIds: updatedPoint.offers
          .filter((offer) => offer.isChecked)
          .map((offer) => offer.id)
      } : point
    );

    const updatedPointForView = this.#createPointForView(
      this.#pointModel.points.find((point) => point.id === updatedPoint.id)
    );

    this.#pointPresenters.get(updatedPoint.id).init(updatedPointForView);
  };
}
