import FrameworkApiService from '../framework/api-service.js';
import PointAdapter from './point-adapter.js';

export default class ApiService extends FrameworkApiService {

  get points() {
    return this._load({url: 'points'})
      .then(ApiService.parseResponse);
  }

  get destinations() {
    return this._load({url: 'destinations'})
      .then(ApiService.parseResponse);
  }

  get offers() {
    return this._load({url: 'offers'})
      .then(ApiService.parseResponse);
  }

  updatePoint(point) {
    return this._load({
      url: `points/${point.id}`,
      method: 'PUT',
      body: JSON.stringify(PointAdapter.adaptToServer(point)),
      headers: new Headers({'Content-Type': 'application/json'})
    })
      .then(ApiService.parseResponse);
  }

  addPoint(point) {
    return this._load({
      url: 'points',
      method: 'POST',
      body: JSON.stringify(PointAdapter.adaptToServer(point)),
      headers: new Headers({'Content-Type': 'application/json'})
    })
      .then(ApiService.parseResponse);
  }

  deletePoint(point) {
    return this._load({
      url: `points/${point.id}`,
      method: 'DELETE'
    });
  }
}
