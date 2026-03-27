import {points, destinations, offers} from '../mock/point.js';

/**
 * Point Model
 * Хранит временные данные точек маршрута
 */

export default class PointModel {
  #points = points;
  #destinations = destinations;
  #offers = offers;

  get points() {
    return this.#points;
  }

  get destinations() {
    return this.#destinations;
  }

  get offers() {
    return this.#offers;
  }
}
