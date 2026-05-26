import dayjs from 'dayjs';

function formatDate(date) {
  if (!date) {
    return '';
  }

  const currentDate = new Date(date);

  const day = String(currentDate.getDate()).padStart(2, '0');
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const year = String(currentDate.getFullYear()).slice(-2);

  const hours = String(currentDate.getHours()).padStart(2, '0');
  const minutes = String(currentDate.getMinutes()).padStart(2, '0');

  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

function formatTime(date) {
  return date ? dayjs(date).format('HH:mm') : '';
}

function formatPointDate(date) {
  return date ? dayjs(date).format('MMM DD').toUpperCase() : '';
}

function formatDuration(dateFrom, dateTo) {
  const difference = dayjs(dateTo).diff(dayjs(dateFrom), 'minute');

  const hours = Math.floor(difference / 60);
  const minutes = difference % 60;

  if (hours > 0) {
    return `${hours}H ${minutes}M`;
  }

  return `${minutes}M`;
}

function humanizeTripInfoDate(date) {
  return date ? dayjs(date).format('MMM D') : '';
}

export {
  formatDate,
  formatTime,
  formatPointDate,
  formatDuration,
  humanizeTripInfoDate
};
