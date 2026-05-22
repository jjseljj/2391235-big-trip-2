import {FilterType} from '../const.js';

const filterConfig = {
  [FilterType.EVERYTHING]: {
    name: 'Everything',
    check: () => true
  },
  [FilterType.FUTURE]: {
    name: 'Future',
    check: isFuturePoint
  },
  [FilterType.PRESENT]: {
    name: 'Present',
    check: isPresentPoint
  },
  [FilterType.PAST]: {
    name: 'Past',
    check: isPastPoint
  }
};

const emptyListMessages = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.FUTURE]: 'There are no future events now',
  [FilterType.PRESENT]: 'There are no present events now',
  [FilterType.PAST]: 'There are no past events now'
};

function isFuturePoint(point) {
  const now = new Date();
  return new Date(point.dateFrom) > now;
}

function isPresentPoint(point) {
  const now = new Date();
  const dateFrom = new Date(point.dateFrom);
  const dateTo = new Date(point.dateTo);

  return dateFrom <= now && dateTo >= now;
}

function isPastPoint(point) {
  const now = new Date();
  return new Date(point.dateTo) < now;
}

export {filterConfig, emptyListMessages};
