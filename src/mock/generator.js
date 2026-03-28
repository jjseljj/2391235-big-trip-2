const getRandomId = () => crypto.randomUUID();

const generatePicture = () => ({
  src: `https://loremflickr.com/248/152?random=${Math.random()}`,
  description: 'Destination photo'
});

const generateDestination = (name = 'Amsterdam') => ({
  id: getRandomId(),
  name,
  description: 'Lorem ipsum dolor sit amet.',
  pictures: [generatePicture()]
});

const generateOffer = (title = 'Extra option') => ({
  id: getRandomId(),
  title,
  price: Math.floor(Math.random() * 100) + 1
});

const generateOffersByType = (type, offers) => ({
  type,
  offers
});

const generatePoint = (type, destinationId, offerIds) => ({
  id: getRandomId(),
  basePrice: Math.floor(Math.random() * 200) + 1,
  dateFrom: '2025-03-18T10:30:00.000Z',
  dateTo: '2025-03-18T11:00:00.000Z',
  destinationId,
  isFavorite: false,
  offerIds,
  type
});

export {
  generateDestination,
  generateOffer,
  generateOffersByType,
  generatePoint
};
