const adaptPointToClient = (point) => ({
  id: point.id,
  type: point.type,
  destinationId: point.destination,
  dateFrom: point['date_from'],
  dateTo: point['date_to'],
  basePrice: point['base_price'],
  isFavorite: point['is_favorite'],
  offerIds: point.offers
});

const adaptPointToServer = (point) => ({
  id: point.id,
  type: point.type,
  destination: point.destinationId,
  'date_from': point.dateFrom,
  'date_to': point.dateTo,
  'base_price': point.basePrice,
  'is_favorite': point.isFavorite,
  offers: point.offerIds
});

export {adaptPointToClient, adaptPointToServer};
