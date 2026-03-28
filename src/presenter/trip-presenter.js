import {render, RenderPosition} from '../render.js';
import FiltersView from '../view/filters-view.js';
import SortView from '../view/sort-view.js';
import PointView from '../view/point-view.js';
import EditPointView from '../view/edit-point-view.js';

export default class TripPresenter {
  #tripControlsFiltersContainer = null;
  #tripEventsContainer = null;
  #tripEventsListContainer = null;
  #pointModel = null;

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

  init() {
    render(new FiltersView(), this.#tripControlsFiltersContainer);
    render(new SortView(), this.#tripEventsContainer, RenderPosition.AFTERBEGIN);

    const firstPoint = this.#createPointForView(this.#pointModel.points[0]);

    render(
      new EditPointView({
        point: firstPoint,
        destinations: this.#pointModel.destinations,
        offersByType: this.#pointModel.offers
      }),
      this.#tripEventsListContainer,
      RenderPosition.AFTERBEGIN
    );

    this.#pointModel.points.forEach((point) => {
      const pointForView = this.#createPointForView(point);

      render(
        new PointView({point: pointForView}),
        this.#tripEventsListContainer
      );
    });
  }
}
