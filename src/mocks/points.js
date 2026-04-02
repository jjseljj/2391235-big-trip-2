import {destinations} from './destinations.js';
import {taxiOffer1, flightOffer1, flightOffer2} from './offers.js';

const points = [
  {
    id: crypto.randomUUID(),
    'base_price': 120,
    'date_from': '2025-03-18T10:30:00.000Z',
    'date_to': '2025-03-18T11:00:00.000Z',
    destination: destinations[0].id,
    'is_favorite': false,
    offers: [taxiOffer1.id],
    type: 'taxi'
  },
  {
    id: crypto.randomUUID(),
    'base_price': 180,
    'date_from': '2025-03-18T13:30:00.000Z',
    'date_to': '2025-03-18T14:00:00.000Z',
    destination: destinations[1].id,
    'is_favorite': false,
    offers: [flightOffer1.id, flightOffer2.id],
    type: 'flight'
  },
  {
    id: crypto.randomUUID(),
    'base_price': 95,
    'date_from': '2025-03-19T09:00:00.000Z',
    'date_to': '2025-03-19T09:40:00.000Z',
    destination: destinations[0].id,
    'is_favorite': false,
    offers: [taxiOffer1.id],
    type: 'taxi'
  }
];

export {points};
