import AbstractView from './abstract-view.js';

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

function formatDate(date) {
  if (!date) {
    return '';
  }

  const currentDate = new Date(date);

  const day = String(currentDate.getDate()).padStart(2, '0');
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const year = currentDate.getFullYear();

  const hours = String(currentDate.getHours()).padStart(2, '0');
  const minutes = String(currentDate.getMinutes()).padStart(2, '0');

  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

function createTypeItemTemplate(currentType, type) {
  const checkedAttribute = currentType === type ? 'checked' : '';

  return `<div class="event__type-item">
    <input
      id="event-type-${type}-1"
      class="event__type-input visually-hidden"
      type="radio"
      name="event-type"
      value="${type}"
      ${checkedAttribute}
    >
    <label class="event__type-label event__type-label--${type}" for="event-type-${type}-1">${type}</label>
  </div>`;
}

function createOfferItemTemplate(offer) {
  const checkedAttribute = offer.isChecked ? 'checked' : '';

  return `<div class="event__offer-selector">
    <input
      class="event__offer-checkbox visually-hidden"
      id="event-offer-${offer.id}-1"
      type="checkbox"
      name="event-offer-${offer.id}"
      ${checkedAttribute}
    >
    <label class="event__offer-label" for="event-offer-${offer.id}-1">
      <span class="event__offer-title">${offer.title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${offer.price}</span>
    </label>
  </div>`;
}

function createOffersTemplate(offers) {
  if (!offers.length) {
    return '';
  }

  return `<section class="event__section event__section--offers">
    <h3 class="event__section-title event__section-title--offers">Offers</h3>
    <div class="event__available-offers">
      ${offers.map((offer) => createOfferItemTemplate(offer)).join('')}
    </div>
  </section>`;
}

function createPicturesTemplate(pictures) {
  if (!pictures.length) {
    return '';
  }

  return `<div class="event__photos-container">
    <div class="event__photos-tape">
      ${pictures.map((picture) => `<img class="event__photo" src="${picture}" alt="Event photo">`).join('')}
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

function createEditPointTemplate(point) {
  const {
    type,
    destination,
    dateFrom,
    dateTo,
    basePrice,
    offers
  } = point;

  const typeListTemplate = EVENT_TYPES
    .map((eventType) => createTypeItemTemplate(type, eventType))
    .join('');

  return `<form class="event event--edit" action="#" method="post">
    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type event__type-btn" for="event-type-toggle-1">
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
          id="event-type-toggle-1"
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
        <label class="event__label event__type-output" for="event-destination-1">
          ${type}
        </label>
        <input
          class="event__input event__input--destination"
          id="event-destination-1"
          type="text"
          name="event-destination"
          value="${destination.name}"
          list="destination-list-1"
        >
        <datalist id="destination-list-1">
          <option value="Amsterdam"></option>
          <option value="Geneva"></option>
          <option value="Chamonix"></option>
        </datalist>
      </div>

      <div class="event__field-group event__field-group--time">
        <label class="visually-hidden" for="event-start-time-1">From</label>
        <input
          class="event__input event__input--time"
          id="event-start-time-1"
          type="text"
          name="event-start-time"
          value="${formatDate(dateFrom)}"
        >
        &mdash;
        <label class="visually-hidden" for="event-end-time-1">To</label>
        <input
          class="event__input event__input--time"
          id="event-end-time-1"
          type="text"
          name="event-end-time"
          value="${formatDate(dateTo)}"
        >
      </div>

      <div class="event__field-group event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input
          class="event__input event__input--price"
          id="event-price-1"
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
      ${createOffersTemplate(offers)}
      ${createDestinationTemplate(destination)}
    </section>
  </form>`;
}

export default class EditPointView extends AbstractView {
  #point = null;

  constructor({ point } = {}) {
    super();
    this.#point = point || {
      type: 'flight',
      destination: {
        name: '',
        description: '',
        pictures: []
      },
      dateFrom: '',
      dateTo: '',
      basePrice: '',
      offers: []
    };
  }

  get template() {
    return createEditPointTemplate(this.#point);
  }
}
