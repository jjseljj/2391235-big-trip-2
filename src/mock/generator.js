const getRandomId = () => crypto.randomUUID();

const generateDestination = (name = 'Amsterdam') => ({
  id: getRandomId(),
  name,
  description: 'Lorem ipsum dolor sit amet.',
  pictures: [
    `https://loremflickr.com/248/152?random=${Math.random()}`
  ]
});

const generateOffer = (type, title = 'Extra option') => ({
  id: getRandomId(),
  type,
  title,
  price: Math.floor(Math.random() * 100)
});

const generatePoint = (type, destinationId, offers) => ({
  id: getRandomId(),
  type,
  destinationId,
  dateFrom: '2025-03-18T10:30',
  dateTo: '2025-03-18T11:00',
  basePrice: Math.floor(Math.random() * 200) + 1,
  isFavorite: false,
  offerIds: offers.map((offer) => offer.id)
});

export {generateDestination, generateOffer, generatePoint};
