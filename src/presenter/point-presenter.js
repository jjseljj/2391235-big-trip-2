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
  #editedPoint = null;

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
      point: this.#editedPoint ?? this.#point,
      destinations: this.#destinations,
      onFormSubmit: this.#handleFormSubmit,
      onRollupClick: this.#replaceFormToPoint
    });

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

  #handleFormSubmit = () => {
    this.#onDataChange(this.#editedPoint);
    this.#replaceFormToPoint();
  };

  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#replaceFormToPoint();
    }
  }

  #replacePointToForm = () => {
    this.#onModeChange();
    this.#editedPoint = {
      ...this.#point,
      destination: {...this.#point.destination},
      offers: this.#point.offers.map((offer) => ({...offer}))
    };

    const prevEditPointComponent = this.#editPointComponent;

    this.#editPointComponent = new EditPointView({
      point: this.#editedPoint,
      destinations: this.#destinations,
      onFormSubmit: this.#handleFormSubmit,
      onRollupClick: this.#replaceFormToPoint
    });

    replace(this.#editPointComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.EDITING;

    if (prevEditPointComponent !== null) {
      prevEditPointComponent.removeElement();
    }
  };

  #replaceFormToPoint = () => {
    this.#editedPoint = null;
    replace(this.#pointComponent, this.#editPointComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
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
      //destination: {...this.#point.destination},
      //offers: this.#point.offers.map((offer) => ({...offer})),
      isFavorite: !this.#point.isFavorite
    });
  };
}
