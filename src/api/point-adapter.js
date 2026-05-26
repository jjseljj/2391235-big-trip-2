export default class PointAdapter {
  static adaptToClient(point) {
    return {
      id: point.id,
      basePrice: point['base_price'],
      dateFrom: point['date_from'],
      dateTo: point['date_to'],
      destinationId: point.destination,
      isFavorite: point['is_favorite'],
      offerIds: point.offers,
      type: point.type
    };
  }

  static adaptToServer(point) {
    return {
      'base_price': point.basePrice,
      'date_from': point.dateFrom,
      'date_to': point.dateTo,
      destination: point.destinationId,
      'is_favorite': point.isFavorite,
      offers: point.offerIds,
      type: point.type,
      id: point.id
    };
  }
}
