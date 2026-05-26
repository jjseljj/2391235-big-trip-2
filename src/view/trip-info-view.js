import AbstractView from '../framework/view/abstract-view.js';
import {humanizeTripInfoDate} from '../utils/date.js';

function createRouteTemplate(points) {
  if (points.length === 0) {
    return '';
  }

  const cities = points.map((point) => point.destination.name);

  if (cities.length > 3) {
    return `${cities[0]} &mdash; ${cities[cities.length - 1]}`;
  }

  return cities.join(' &mdash; ');
}

function createDatesTemplate(points) {
  if (points.length === 0) {
    return '';
  }

  const startDate = points[0].dateFrom;
  const endDate = points[points.length - 1].dateTo;

  return `${humanizeTripInfoDate(startDate)}&nbsp;&mdash;&nbsp;${humanizeTripInfoDate(endDate)}`;
}

function calculateTripPrice(points) {
  return points.reduce((total, point) => {
    const offersPrice = point.offers
      .filter((offer) => offer.isChecked)
      .reduce((sum, offer) => sum + offer.price, 0);

    return total + point.basePrice + offersPrice;
  }, 0);
}

function createTripInfoTemplate(points) {
  return `
    <section class="trip-main__trip-info trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">${createRouteTemplate(points)}</h1>

        <p class="trip-info__dates">${createDatesTemplate(points)}</p>
      </div>

      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${calculateTripPrice(points)}</span>
      </p>
    </section>
  `;
}

export default class TripInfoView extends AbstractView {
  #points = [];

  constructor({points}) {
    super();
    this.#points = points;
  }

  get template() {
    return createTripInfoTemplate(this.#points);
  }
}
