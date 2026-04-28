import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';

const EVENT_TYPES = [
  'taxi',
  'bus',
  'train',
  'ship',
  'drive',
  'flight',
  'check-in',
  'sightseeing',
  'restaurant'
];

const EMPTY_POINT = {
  type: 'flight',
  destination: {
    name: '',
    description: '',
    pictures: []
  },
  dateFrom: '',
  dateTo: '',
  basePrice: 0,
  offers: []
};

function formatDate(date) {
  if (!date) {
    return '';
  }

  const currentDate = new Date(date);

  const day = String(currentDate.getDate()).padStart(2, '0');
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const year = String(currentDate.getFullYear()).slice(-2);

  const hours = String(currentDate.getHours()).padStart(2, '0');
  const minutes = String(currentDate.getMinutes()).padStart(2, '0');

  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

function createTypeItemTemplate(currentType, type, formId) {
  const checkedAttribute = currentType === type ? 'checked' : '';

  return `<div class="event__type-item">
    <input
      id="event-type-${type}-${formId}"
      class="event__type-input visually-hidden"
      type="radio"
      name="event-type"
      value="${type}"
      ${checkedAttribute}
    >
    <label class="event__type-label event__type-label--${type}" for="event-type-${type}-${formId}">${type}</label>
  </div>`;
}

function createOfferItemTemplate(offer, formId) {
  const checkedAttribute = offer.isChecked ? 'checked' : '';

  return `<div class="event__offer-selector">
    <input
      class="event__offer-checkbox visually-hidden"
      id="event-offer-${offer.id}-${formId}"
      type="checkbox"
      name="event-offer-${offer.id}"
      ${checkedAttribute}
    >
    <label class="event__offer-label" for="event-offer-${offer.id}-${formId}">
      <span class="event__offer-title">${offer.title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${offer.price}</span>
    </label>
  </div>`;
}

function createOffersTemplate(offers, formId) {
  if (!offers.length) {
    return '';
  }

  return `<section class="event__section event__section--offers">
    <h3 class="event__section-title event__section-title--offers">Offers</h3>
    <div class="event__available-offers">
      ${offers.map((offer) => createOfferItemTemplate(offer, formId)).join('')}
    </div>
  </section>`;
}

function createPicturesTemplate(pictures) {
  if (!pictures.length) {
    return '';
  }

  return `<div class="event__photos-container">
    <div class="event__photos-tape">
      ${pictures.map((picture) => `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`).join('')}
    </div>
  </div>`;
}

function createDestinationTemplate(destination) {
  if (!destination.name && !destination.description && !destination.pictures.length) {
    return '';
  }

  return `<section class="event__section event__section--destination">
    <h3 class="event__section-title event__section-title--destination">Destination</h3>
    <p class="event__destination-description">${destination.description}</p>
    ${createPicturesTemplate(destination.pictures)}
  </section>`;
}

function createDestinationListTemplate(destinations) {
  return destinations.map((item) => `<option value="${item.name}"></option>`).join('');
}

function createEditPointTemplate(point, destinations, formId) {
  const {
    type,
    destination,
    dateFrom,
    dateTo,
    basePrice,
    offers
  } = point;

  const typeListTemplate = EVENT_TYPES
    .map((eventType) => createTypeItemTemplate(type, eventType, formId))
    .join('');

  const destinationListTemplate = createDestinationListTemplate(destinations);

  return (
    `
    <form class="event event--edit" action="#" method="post">
    <header class="event__header">
      <div class="event__type-wrapper">
        <label
          class="event__type event__type-btn"
          for="event-type-toggle-${formId}"
        >
          <span class="visually-hidden">Choose event type</span>
          <img
            class="event__type-icon"
            width="17"
            height="17"
            src="img/icons/${type}.png"
            alt="Event type icon"
          >
        </label>
        <input
          class="event__type-toggle visually-hidden"
          id="event-type-toggle-${formId}"
          type="checkbox"
        >

        <div class="event__type-list">
          <fieldset class="event__type-group">
            <legend class="visually-hidden">Event type</legend>
            ${typeListTemplate}
          </fieldset>
        </div>
      </div>

      <div class="event__field-group event__field-group--destination">
        <label
          class="event__label event__type-output"
          for="event-destination-${formId}"
        >
          ${type}
        </label>
        <input
          class="event__input event__input--destination"
          id="event-destination-${formId}"
          type="text"
          name="event-destination"
          value="${destination.name}"
          list="destination-list-${formId}"
        >
        <datalist id="destination-list-${formId}">
          ${destinationListTemplate}
        </datalist>
      </div>

      <div class="event__field-group event__field-group--time">
        <label
          class="visually-hidden"
          for="event-start-time-${formId}"
        >
          From
        </label>
        <input
          class="event__input event__input--time"
          id="event-start-time-${formId}"
          type="text"
          name="event-start-time"
          value="${formatDate(dateFrom)}"
        >
        &mdash;
        <label
          class="visually-hidden"
          for="event-end-time-${formId}"
        >
        To
        </label>
        <input
          class="event__input event__input--time"
          id="event-end-time-${formId}"
          type="text"
          name="event-end-time"
          value="${formatDate(dateTo)}"
        >
      </div>

      <div class="event__field-group event__field-group--price">
        <label class="event__label" for="event-price-${formId}">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input
          class="event__input event__input--price"
          id="event-price-${formId}"
          type="text"
          name="event-price"
          value="${basePrice}"
        >
      </div>

      <button class="event__save-btn btn btn--blue" type="submit">Save</button>
      <button class="event__reset-btn" type="reset">Delete</button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </header>

    <section class="event__details">
      ${createOffersTemplate(offers, formId)}
      ${createDestinationTemplate(destination)}
    </section>
  </form>
  `
  );
}

export default class EditPointView extends AbstractStatefulView {
  #destinations = null;
  #formId = null;
  #onFormSubmit = null;
  #onRollupClick = null;
  #offersByType = null;

  constructor({point, destinations, offersByType, onFormSubmit, onRollupClick} = {}) {
    super();
    this.#formId = crypto.randomUUID();
    this._setState(point ? {
      ...point,
      destination: {...point.destination},
      offers: point.offers.map((offer) => ({...offer}))
    } : {
      ...EMPTY_POINT,
      destination: {...EMPTY_POINT.destination},
      offers: [...EMPTY_POINT.offers]
    });
    this.#destinations = destinations || [];
    this.#offersByType = offersByType || [];
    this.#onFormSubmit = onFormSubmit;
    this.#onRollupClick = onRollupClick;

    this.element.addEventListener('submit', this.#formSubmitHandler);
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#rollupClickHandler);
    this.element.querySelector('.event__type-group').addEventListener('change', this.#typeChangeHandler);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#destinationChangeHandler);
    this.element.querySelector('.event__available-offers')?.addEventListener('change', this.#offersChangeHandler);
  }

  get template() {
    return createEditPointTemplate(this._state, this.#destinations, this.#formId);
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    if (this.#onFormSubmit) {
      this.#onFormSubmit(this._state);
    }
  };

  #rollupClickHandler = (evt) => {
    evt.preventDefault();
    if (this.#onRollupClick) {
      this.#onRollupClick();
    }
  };

  #typeChangeHandler = (evt) => {
    const selectedType = evt.target.value;
    const offersByType = this.#offersByType.find((item) => item.type === selectedType);
    const offers = offersByType ? offersByType.offers.map((offer) => ({
      ...offer,
      isChecked: false
    })) : [];

    this.updateElement({
      type: selectedType,
      offers
    });
  };

  #destinationChangeHandler = (evt) => {
    const selectedDestination = this.#destinations.find((destination) => destination.name === evt.target.value);

    if (!selectedDestination) {
      return;
    }

    this.updateElement({
      destination: {
        ...selectedDestination,
        pictures: selectedDestination.pictures.map((picture) => ({...picture}))
      }
    });
  };

  _restoreHandlers() {
    this.element.addEventListener('submit', this.#formSubmitHandler);
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#rollupClickHandler);
    this.element.querySelector('.event__type-group').addEventListener('change', this.#typeChangeHandler);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#destinationChangeHandler);
    this.element.querySelector('.event__available-offers')?.addEventListener('change', this.#offersChangeHandler);
  }

  #offersChangeHandler = (evt) => {
    const offerId = Number(evt.target.name.replace('event-offer-', ''));

    this._setState({
      offers: this._state.offers.map((offer) => offer.id === offerId
        ? {
          ...offer,
          isChecked: evt.target.checked
        }
        : offer)
    });
  };
}
