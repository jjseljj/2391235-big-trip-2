import {points} from '../mocks/points.js';
import {destinations} from '../mocks/destinations.js';
import {offers} from '../mocks/offers.js';
import {adaptPointToClient} from '../adapter/point-adapter.js';

export default class PointModel {
  #points = points.map(adaptPointToClient);
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

  setPoints(newPoints) {
    this.#points = newPoints.map(adaptPointToClient);
  }

  updatePoint(updatedPoint) {
    this.#points = this.#points.map((point) =>
      point.id === updatedPoint.id ? updatedPoint : point
    );
  }

  addPoint(newPoint) {
    this.#points = [newPoint, ...this.#points];
  }

  deletePoint(pointId) {
    this.#points = this.#points.filter(
      (point) => point.id !== pointId
    );
  }
}
