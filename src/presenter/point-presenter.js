import {render, replace, remove, RenderPosition} from '../framework/render.js';
import PointView from '../view/point-view.js';
import EditPointView from '../view/edit-point-view.js';
import {UserAction, UpdateType} from '../const.js';

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
  #onDestroy = null;

  constructor({container, destinations, offersByType, onModeChange, onDataChange, onDestroy}) {
    this.#container = container;
    this.#destinations = destinations;
    this.#offersByType = offersByType;
    this.#onModeChange = onModeChange;
    this.#onDataChange = onDataChange;
    this.#onDestroy = onDestroy;
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
      offersByType: this.#offersByType,
      onFormSubmit: this.#handleFormSubmit,
      onRollupClick: this.#replaceFormToPoint,
      onDeleteClick: this.#handleDeleteClick
    });

    if (prevPointComponent === null || prevEditPointComponent === null) {
      render(this.#pointComponent, this.#container, RenderPosition.BEFOREEND);

      if (!this.#point.id) {
        this.#replacePointToForm();
      }

      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#editPointComponent, prevEditPointComponent);
    }

    if (!this.#point.id) {
      this.#replacePointToForm();
    }
  }

  #handleFormSubmit = (updatedPoint) => {
    this.setSaving();

    if (!this.#point.id) {
      this.#onDataChange(UserAction.ADD_POINT, updatedPoint, UpdateType.MINOR);
      return;
    }

    this.#onDataChange(UserAction.UPDATE_POINT, updatedPoint, UpdateType.MINOR);
  };

  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#replaceFormToPoint();
    }
  }

  setSaving() {
    this.#editPointComponent.updateElement({
      ...this.#editPointComponent._state,
      isDisabled: true,
      isSaving: true
    });
  }

  setDeleting() {
    this.#editPointComponent.updateElement({
      ...this.#editPointComponent._state,
      isDisabled: true,
      isDeleting: true
    });
  }

  setAborting() {
    const resetFormState = {
      ...this.#editPointComponent._state,
      isDisabled: false,
      isSaving: false,
      isDeleting: false
    };

    this.#editPointComponent.updateElement(resetFormState);

    this.#editPointComponent.shake();
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
      offersByType: this.#offersByType,
      onFormSubmit: this.#handleFormSubmit,
      onRollupClick: this.#replaceFormToPoint,
      onDeleteClick: this.#handleDeleteClick
    });

    replace(this.#editPointComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.EDITING;

    if (prevEditPointComponent !== null) {
      remove(prevEditPointComponent);
    }
  };

  #replaceFormToPoint = () => {
    this.#editedPoint = null;
    document.removeEventListener('keydown', this.#escKeyDownHandler);

    if (!this.#point.id) {
      remove(this.#editPointComponent);
      remove(this.#pointComponent);
      this.#onDestroy?.();
      return;
    }

    replace(this.#pointComponent, this.#editPointComponent);
    this.#mode = Mode.DEFAULT;
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#replaceFormToPoint();
    }
  };

  #handleFavoriteClick = () => {
    this.#onDataChange(UserAction.UPDATE_POINT, {
      ...this.#point,
      isFavorite: !this.#point.isFavorite
    }, UpdateType.PATCH);
  };

  destroy() {
    remove(this.#pointComponent);
    remove(this.#editPointComponent);

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #handleDeleteClick = (point) => {
    this.setDeleting();

    this.#onDataChange(UserAction.DELETE_POINT, point, UpdateType.MINOR);
  };
}
