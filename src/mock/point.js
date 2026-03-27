import {generateDestination, generateOffer, generatePoint} from './generator.js';

const destination1 = generateDestination('Amsterdam');
const destination2 = generateDestination('Chamonix');

const offer1 = generateOffer('taxi', 'Order Uber');
const offer2 = generateOffer('flight', 'Add luggage');
const offer3 = generateOffer('flight', 'Switch to comfort');

const destinations = [destination1, destination2];
const offers = [offer1, offer2, offer3];

const points = [
  generatePoint('taxi', destination1.id, [offer1]),
  generatePoint('flight', destination2.id, [offer2, offer3]),
  generatePoint('taxi', destination1.id, [offer1])
];

export {destinations, offers, points};

/*const destinations = [
  {
    id: 'destination-1',
    name: 'Amsterdam',
    description: 'Amsterdam description',
    pictures: [
      'img/photos/1.jpg',
      'img/photos/2.jpg'
    ]
  },
  {
    id: 'destination-2',
    name: 'Chamonix',
    description: 'Chamonix description',
    pictures: [
      'img/photos/3.jpg',
      'img/photos/4.jpg'
    ]
  }
];

const offers = [
  {
    id: 'offer-1',
    type: 'taxi',
    title: 'Order Uber',
    price: 20
  },
  {
    id: 'offer-2',
    type: 'flight',
    title: 'Add luggage',
    price: 30
  },
  {
    id: 'offer-3',
    type: 'flight',
    title: 'Switch to comfort',
    price: 100
  }
];

const points = [
  {
    id: 'point-1',
    type: 'taxi',
    destinationId: 'destination-1',
    dateFrom: '2025-03-18T10:30',
    dateTo: '2025-03-18T11:00',
    basePrice: 20,
    isFavorite: true,
    offerIds: ['offer-1']
  },
  {
    id: 'point-2',
    type: 'flight',
    destinationId: 'destination-2',
    dateFrom: '2025-03-18T12:25',
    dateTo: '2025-03-18T13:35',
    basePrice: 160,
    isFavorite: false,
    offerIds: ['offer-2', 'offer-3']
  },
  {
    id: 'point-3',
    type: 'taxi',
    destinationId: 'destination-1',
    dateFrom: '2025-03-19T10:30',
    dateTo: '2025-03-19T11:00',
    basePrice: 25,
    isFavorite: false,
    offerIds: ['offer-1']
  }
];

export {destinations, offers, points};*/
