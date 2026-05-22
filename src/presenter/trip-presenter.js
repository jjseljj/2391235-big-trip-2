import {render, RenderPosition, remove} from '../framework/render.js';
import SortView from '../view/sort-view.js';
import EmptyPointListView from '../view/empty-point-list-view.js';
import PointPresenter from './point-presenter.js';
import {FilterType, SortType, UserAction, UpdateType} from '../const.js';
import TripEventsListView from '../view/trip-events-list-view.js';
import {sortPointByDay, sortPointByTime, sortPointByPrice} from '../utils/point.js';
import {filterConfig, emptyListMessages} from '../const/filter.js';
import LoadingView from '../view/loading-view.js';

export default class TripPresenter {
  #tripEventsContainer = null;
  #tripEventsListContainer = null;
  #pointModel = null;
  #filterModel = null;
  #pointPresenters = new Map();
  #currentSortType = SortType.DAY;
  #sortComponent = null;
  #emptyComponent = null;
  #loadingComponent = new LoadingView();
  #onNewPointDestroy = null;
  #newPointPresenter = null;
  #tripEventsListComponent = new TripEventsListView();

  constructor({tripEventsContainer, pointModel, filterModel, onNewPointDestroy}) {
    this.#tripEventsContainer = tripEventsContainer;
    this.#pointModel = pointModel;
    this.#filterModel = filterModel;
    this.#filterModel.addObserver(this.#handleModelEvent);
    this.#pointModel.addObserver(this.#handleModelEvent);
    this.#onNewPointDestroy = onNewPointDestroy;
  }

  renderLoading() {
    render(this.#loadingComponent, this.#tripEventsContainer);
  }

  #clearLoading() {
    remove(this.#loadingComponent);
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
    this.#clearLoading();
    render(this.#tripEventsListComponent, this.#tripEventsContainer);
    this.#tripEventsListContainer = this.#tripEventsListComponent.element;

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

    if (this.#newPointPresenter) {
      this.#newPointPresenter.resetView();
    }
  };

  #renderPoints() {
    const sortedPoints = [...this.#points];

    switch (this.#currentSortType) {
      case SortType.TIME:
        sortedPoints.sort(sortPointByTime);
        break;
      case SortType.PRICE:
        sortedPoints.sort(sortPointByPrice);
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

  #handlePointChange = (userAction, updatedPoint, updateType) => {
    switch (userAction) {
      case UserAction.ADD_POINT: {
        this.#onNewPointDestroy?.();
        const nextPoint = this.#createPointFromView({
          ...updatedPoint,
          id: crypto.randomUUID()
        });

        this.#pointModel.addPoint(updateType, nextPoint);
        break;
      }
      case UserAction.UPDATE_POINT: {
        const nextPoint = this.#createPointFromView(updatedPoint);

        this.#pointModel.updatePoint(updateType, nextPoint);
        break;
      }

      case UserAction.DELETE_POINT: {
        const pointToDelete = this.#createPointFromView(updatedPoint);

        this.#pointModel.deletePoint(updateType, pointToDelete);
        break;
      }
    }
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearPointList();
    this.#renderPoints();
  };

  #clearPointList() {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
  }

  #clearSort() {
    if (this.#sortComponent) {
      remove(this.#sortComponent);
      this.#sortComponent = null;
    }
  }

  #clearBoard({resetSortType = false} = {}) {
    this.#clearPointList();
    this.#clearEmptyList();
    this.#clearSort();

    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }
  }

  get #points() {
    const filterType = this.#filterModel.filter;
    const points = this.#pointModel.points;

    return points.filter(filterConfig[filterType].check);
  }

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenters.get(data.id).init(this.#createPointForView(data));
        break;

      case UpdateType.MINOR:
        this.#clearBoard();
        this.init();
        break;

      case UpdateType.MAJOR:
        this.#clearBoard({resetSortType: true});
        this.init();
        break;
    }
  };

  #clearEmptyList() {
    if (this.#emptyComponent) {
      remove(this.#emptyComponent);
      this.#emptyComponent = null;
    }
  }

  createPoint() {
    this.#handleModeChange();

    this.#filterModel.setFilter(FilterType.EVERYTHING);

    this.#newPointPresenter = new PointPresenter({
      container: this.#tripEventsListContainer,
      destinations: this.#pointModel.destinations,
      offersByType: this.#pointModel.offers,
      onModeChange: this.#handleModeChange,
      onDataChange: this.#handlePointChange,
      onDestroy: this.#onNewPointDestroy
    });

    this.#newPointPresenter.init({
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
  }
}
