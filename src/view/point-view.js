import AbstractView from '../framework/view/abstract-view.js';

function formatTime(date) {
  if (!date) {
    return '';
  }

  const currentDate = new Date(date);

  const hours = String(currentDate.getHours()).padStart(2, '0');
  const minutes = String(currentDate.getMinutes()).padStart(2, '0');

  return `${hours}:${minutes}`;
}

function formatPointDate(date) {
  if (!date) {
    return '';
  }

  const currentDate = new Date(date);
  const day = String(currentDate.getDate()).padStart(2, '0');
  const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  const month = monthNames[currentDate.getMonth()];

  return `${month} ${day}`;
}

function formatDuration(dateFrom, dateTo) {
  const startDate = new Date(dateFrom);
  const endDate = new Date(dateTo);
  const difference = endDate - startDate;

  const minutes = Math.floor(difference / (1000 * 60));
  const hours = Math.floor(minutes / 60);
  const restMinutes = minutes % 60;

  if (hours > 0) {
    return `${hours}H ${restMinutes}M`;
  }

  return `${minutes}M`;
}

function createOffersTemplate(offers) {
  return offers
    .filter((offer) => offer.isChecked)
    .map((offer) => `<li class="event__offer">
      <span class="event__offer-title">${offer.title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${offer.price}</span>
    </li>`)
    .join('');
}

function createPointTemplate(point) {
  const {
    type,
    destination,
    dateFrom,
    dateTo,
    basePrice,
    isFavorite,
    offers
  } = point;

  const favoriteButtonClassName = isFavorite ? 'event__favorite-btn--active' : '';
  const offersTemplate = createOffersTemplate(offers);
  const duration = formatDuration(dateFrom, dateTo);

  return (
    `
    <li class="trip-events__item">
    <div class="event">
      <time class="event__date" datetime="${dateFrom}">${formatPointDate(dateFrom)}</time>
      <div class="event__type">
        <img
          class="event__type-icon"
          width="42"
          height="42"
          src="img/icons/${type}.png"
          alt="Event type icon"
        >
      </div>
      <h3 class="event__title">${type} ${destination.name}</h3>
      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="${dateFrom}">${formatTime(dateFrom)}</time>
          &mdash;
          <time class="event__end-time" datetime="${dateTo}">${formatTime(dateTo)}</time>
        </p>
        <p class="event__duration">${duration}</p>
      </div>
      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
      </p>
      <h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers">
        ${offersTemplate}
      </ul>
      <button class="event__favorite-btn ${favoriteButtonClassName}" type="button">
        <span class="visually-hidden">Add to favorite</span>
        <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
          <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"></path>
        </svg>
      </button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>
  </li>
  `
  );
}

export default class PointView extends AbstractView {
  #point = null;
  #onEditClick = null;
  #onFavoriteClick = null;

  constructor({point, onEditClick, onFavoriteClick}) {
    super();
    this.#point = point;
    this.#onEditClick = onEditClick;
    this.#onFavoriteClick = onFavoriteClick;

    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#editClickHandler);
    this.element.querySelector('.event__favorite-btn').addEventListener('click', this.#favoriteClickHandler);
  }

  get template() {
    return createPointTemplate(this.#point);
  }

  #editClickHandler = (evt) => {
    evt.preventDefault();
    this.#onEditClick();
  };

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    if (this.#onFavoriteClick) {
      this.#onFavoriteClick();
    }
  };
}
