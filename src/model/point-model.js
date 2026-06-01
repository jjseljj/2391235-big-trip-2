import Observable from '../framework/observable.js';
import PointAdapter from '../api/point-adapter.js';
export default class PointModel extends Observable {
  #apiService = null;
  #points = [];
  #destinations = [];
  #offers = [];
  #isLoadingError = false;

  constructor({apiService}) {
    super();
    this.#apiService = apiService;
  }

  get points() {
    return this.#points;
  }

  get destinations() {
    return this.#destinations;
  }

  get offers() {
    return this.#offers;
  }

  get isLoadingError() {
    return this.#isLoadingError;
  }

  async init() {
    try {
      const [points, destinations, offers] = await Promise.all([
        this.#apiService.points,
        this.#apiService.destinations,
        this.#apiService.offers
      ]);

      this.#points = points.map(PointAdapter.adaptToClient);
      this.#destinations = destinations;
      this.#offers = offers;
      this.#isLoadingError = false;
    } catch {
      this.#points = [];
      this.#destinations = [];
      this.#offers = [];
      this.#isLoadingError = true;
    }

    this._notify();
  }

  setPoints(updateType, newPoints) {
    this.#points = newPoints;
    this._notify(updateType, this.#points);
  }

  async updatePoint(updateType, updatedPoint) {
    const index = this.#points.findIndex(
      (point) => point.id === updatedPoint.id
    );

    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }

    const response = await this.#apiService.updatePoint(updatedPoint);
    const adaptedPoint = PointAdapter.adaptToClient(response);

    this.#points = [
      ...this.#points.slice(0, index),
      adaptedPoint,
      ...this.#points.slice(index + 1)
    ];

    this._notify(updateType, adaptedPoint);
  }

  async addPoint(updateType, newPoint) {
    const response = await this.#apiService.addPoint(newPoint);
    const adaptedPoint = PointAdapter.adaptToClient(response);

    this.#points = [adaptedPoint, ...this.#points];

    this._notify(updateType, adaptedPoint);
  }

  async deletePoint(updateType, pointToDelete) {
    const index = this.#points.findIndex(
      (point) => point.id === pointToDelete.id
    );

    if (index === -1) {
      throw new Error('Can\'t delete unexisting point');
    }

    await this.#apiService.deletePoint(pointToDelete);

    this.#points = [
      ...this.#points.slice(0, index),
      ...this.#points.slice(index + 1)
    ];

    this._notify(updateType, pointToDelete);
  }
}


