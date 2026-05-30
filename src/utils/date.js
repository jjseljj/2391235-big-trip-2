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

  const days = Math.floor(difference / 1440);
  const hours = Math.floor((difference % 1440) / 60);
  const minutes = difference % 60;

  if (days > 0) {
    return `${String(days).padStart(2, '0')}D ${String(hours).padStart(2, '0')}H ${String(minutes).padStart(2, '0')}M`;
  }

  if (hours > 0) {
    return `${String(hours).padStart(2, '0')}H ${String(minutes).padStart(2, '0')}M`;
  }

  return `${String(minutes).padStart(2, '0')}M`;
}

function humanizeTripInfoDate(date) {
  return date ? dayjs(date).format('D MMM').toUpperCase() : '';
}

export {
  formatDate,
  formatTime,
  formatPointDate,
  formatDuration,
  humanizeTripInfoDate
};
