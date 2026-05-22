import {points} from '../mocks/points.js';
import {destinations} from '../mocks/destinations.js';
import {offers} from '../mocks/offers.js';
import {adaptPointToClient} from '../adapter/point-adapter.js';
import Observable from '../framework/observable.js';
//import {UpdateType} from '../const.js';

export default class PointModel extends Observable {
  constructor() {
    super();
  }

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

  setPoints(updateType, newPoints) {
    this.#points = newPoints.map(adaptPointToClient);
    this._notify(updateType, this.#points);
  }

  updatePoint(updateType, updatedPoint) {
    const index = this.#points.findIndex(
      (point) => point.id === updatedPoint.id
    );

    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }

    this.#points = [
      ...this.#points.slice(0, index),
      updatedPoint,
      ...this.#points.slice(index + 1)
    ];

    this._notify(updateType, updatedPoint);
  }

  addPoint(updateType, newPoint) {
    this.#points = [newPoint, ...this.#points];

    this._notify(updateType, newPoint);
  }

  deletePoint(updateType, pointToDelete) {
    const index = this.#points.findIndex(
      (point) => point.id === pointToDelete.id
    );

    if (index === -1) {
      throw new Error('Can\'t delete unexisting point');
    }

    this.#points = [
      ...this.#points.slice(0, index),
      ...this.#points.slice(index + 1)
    ];

    this._notify(updateType, pointToDelete);
  }
}
