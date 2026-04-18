import {render, replace} from '../framework/render.js';
import PointView from '../view/point-view.js';
import EditPointView from '../view/edit-point-view.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING'
};

export default class PointPresenter {
  #container = null;
  #point = null;
  #destinations = null;
  #offersByType = null;

  #pointComponent = null;
  #editPointComponent = null;
  #mode = Mode.DEFAULT;
  #onModeChange = null;
  #onDataChange = null;

  constructor({container, destinations, offersByType, onModeChange, onDataChange}) {
    this.#container = container;
    this.#destinations = destinations;
    this.#offersByType = offersByType;
    this.#onModeChange = onModeChange;
    this.#onDataChange = onDataChange;
  }

  init(point) {
    this.#point = point;

    const prevPointComponent = this.#pointComponent;
    const prevEditPointComponent = this.#editPointComponent;

    this.#pointComponent = new PointView({
      point: this.#point,
      onEditClick: this.#replacePointToForm,
      onFavoriteClick: this.#handleFavoriteClick
    });

    this.#editPointComponent = new EditPointView({
      point: this.#point,
      destinations: this.#destinations,
      onFormSubmit: this.#replaceFormToPoint,
      onRollupClick: this.#replaceFormToPoint
    });

    this.#editPointComponent.setTypeChangeHandler(this.#handleTypeChange);

    if (prevPointComponent === null || prevEditPointComponent === null) {
      render(this.#pointComponent, this.#container);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#editPointComponent, prevEditPointComponent);
    }
  }

  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#replaceFormToPoint();
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
    this.#onModeChange();
    replace(this.#editPointComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.EDITING;
  };

  #replaceFormToPoint = () => {
    replace(this.#pointComponent, this.#editPointComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
  };

  #handleTypeChange = (newType) => {
    this.#point = this.#createPointWithType(newType);
    this.init(this.#point);
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#replaceFormToPoint();
    }
  };

  #handleFavoriteClick = () => {
    this.#onDataChange({
      ...this.#point,
      isFavorite: !this.#point.isFavorite
    });
  };
}
