import PointAdapter from './point-adapter.js';

export default class ApiService {
  #endPoint = null;
  #authorization = null;

  constructor(endPoint, authorization) {
    this.#endPoint = endPoint;
    this.#authorization = authorization;
  }

  get points() {
    return this.#load({url: 'points'})
      .then(ApiService.parseResponse);
  }

  get destinations() {
    return this.#load({url: 'destinations'})
      .then(ApiService.parseResponse);
  }

  get offers() {
    return this.#load({url: 'offers'})
      .then(ApiService.parseResponse);
  }

  async #load({url, method = 'GET', body = null, headers = new Headers()}) {
    headers.append('Authorization', this.#authorization);

    const response = await fetch(
      `${this.#endPoint}/${url}`,
      {
        method,
        body,
        headers
      }
    );

    ApiService.checkStatus(response);

    return response;
  }

  static parseResponse(response) {
    return response.json();
  }

  static checkStatus(response) {
    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }
  }

  updatePoint(point) {
    return this.#load({
      url: `points/${point.id}`,
      method: 'PUT',
      body: JSON.stringify(PointAdapter.adaptToServer(point)),
      headers: new Headers({'Content-Type': 'application/json'})
    })
      .then(ApiService.parseResponse);
  }

  addPoint(point) {
    return this.#load({
      url: 'points',
      method: 'POST',
      body: JSON.stringify(PointAdapter.adaptToServer(point)),
      headers: new Headers({'Content-Type': 'application/json'})
    })
      .then(ApiService.parseResponse);
  }

  deletePoint(point) {
    return this.#load({
      url: `points/${point.id}`,
      method: 'DELETE'
    });
  }
}
