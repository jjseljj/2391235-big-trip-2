function isFuturePoint(point) {
  return new Date(point.dateFrom) > new Date();
}

function isPresentPoint(point) {
  const now = new Date();

  return new Date(point.dateFrom) <= now && new Date(point.dateTo) >= now;
}

function isPastPoint(point) {
  return new Date(point.dateTo) < new Date();
}

export {isFuturePoint, isPresentPoint, isPastPoint};
