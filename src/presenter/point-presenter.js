import PointView from '../view/point-view.js';
import EditPointView from '../view/edit-point-view.js';
import {render, RenderPosition} from '../render.js';

export default class PointPresenter {
  #container = null;
  #point = null;
  #destinations = null;
  #offersByType = null;
  #isEditMode = false;

  #pointComponent = null;
  #editPointComponent = null;

  constructor({container, point, destinations, offersByType, isEditMode = false}) {
    this.#container = container;
    this.#point = point;
    this.#destinations = destinations;
    this.#offersByType = offersByType;
    this.#isEditMode = isEditMode;
  }

  init() {
    this.#renderPoint();
  }

  #renderPoint() {
    this.#pointComponent = new PointView({point: this.#point});
    this.#editPointComponent = new EditPointView({
      point: this.#point,
      destinations: this.#destinations
    });

    this.#editPointComponent.setTypeChangeHandler(this.#handleTypeChange);

    if (this.#isEditMode) {
      render(this.#editPointComponent, this.#container, RenderPosition.BEFOREEND);
    } else {
      render(this.#pointComponent, this.#container, RenderPosition.BEFOREEND);
    }

    this.#setPointHandlers();
    this.#setEditFormHandlers();
  }

  #setPointHandlers() {
    const rollupButton = this.#pointComponent.getElement().querySelector('.event__rollup-btn');

    if (rollupButton) {
      rollupButton.addEventListener('click', this.#replacePointToForm);
    }
  }

  #setEditFormHandlers() {
    const rollupButton = this.#editPointComponent.getElement().querySelector('.event__rollup-btn');

    if (rollupButton) {
      rollupButton.addEventListener('click', this.#replaceFormToPoint);
    }
  }

  #getOffersForType(type, checkedOfferIds = []) {
    const offersGroup = this.#offersByType.find((item) => item.type === type);
    const availableOffers = offersGroup ? offersGroup.offers : [];

    return availableOffers.map((offer) => ({
      ...offer,
      isChecked: checkedOfferIds.includes(offer.id)
    }));
  }

  #createPointWithType(type) {
    return {
      ...this.#point,
      type,
      offers: this.#getOffersForType(type)
    };
  }

  #replacePointToForm = () => {
    this.#pointComponent.getElement().replaceWith(this.#editPointComponent.getElement());
  };

  #replaceFormToPoint = () => {
    this.#editPointComponent.getElement().replaceWith(this.#pointComponent.getElement());
  };

  #handleTypeChange = (newType) => {
    this.#point = this.#createPointWithType(newType);

    const prevEditComponent = this.#editPointComponent;
    const prevPointComponent = this.#pointComponent;

    this.#pointComponent = new PointView({point: this.#point});
    this.#editPointComponent = new EditPointView({
      point: this.#point,
      destinations: this.#destinations
    });

    this.#editPointComponent.setTypeChangeHandler(this.#handleTypeChange);

    prevEditComponent.getElement().replaceWith(this.#editPointComponent.getElement());

    if (prevPointComponent.getElement().isConnected) {
      prevPointComponent.getElement().replaceWith(this.#pointComponent.getElement());
    }

    this.#setPointHandlers();
    this.#setEditFormHandlers();
  };
}
