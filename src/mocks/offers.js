import {generateOffer, generateOffersByType} from '../mock/generator.js';

const taxiOffer1 = generateOffer('Order Uber');
const taxiOffer2 = generateOffer('Choose seats');
const taxiOffer3 = generateOffer('Add meal');

const busOffer1 = generateOffer('Infotainment system');
const busOffer2 = generateOffer('Extra legroom');

const trainOffer1 = generateOffer('First class');
const trainOffer2 = generateOffer('Meal');
const trainOffer3 = generateOffer('Window seat');

const flightOffer1 = generateOffer('Add luggage');
const flightOffer2 = generateOffer('Switch to comfort');
const flightOffer3 = generateOffer('Choose seat');
const flightOffer4 = generateOffer('Add meal');

const checkInOffer1 = generateOffer('Early check-in');
const checkInOffer2 = generateOffer('Late check-out');

const sightseeingOffer1 = generateOffer('Audio guide');
const sightseeingOffer2 = generateOffer('Private tour');

const restaurantOffer1 = generateOffer('VIP table');
const restaurantOffer2 = generateOffer('Wine pairing');

const offers = [
  generateOffersByType('taxi', [taxiOffer1, taxiOffer2, taxiOffer3]),
  generateOffersByType('bus', [busOffer1, busOffer2]),
  generateOffersByType('train', [trainOffer1, trainOffer2, trainOffer3]),
  generateOffersByType('flight', [flightOffer1, flightOffer2, flightOffer3, flightOffer4]),
  generateOffersByType('check-in', [checkInOffer1, checkInOffer2]),
  generateOffersByType('sightseeing', [sightseeingOffer1, sightseeingOffer2]),
  generateOffersByType('restaurant', [restaurantOffer1, restaurantOffer2])
];

export {
  offers,
  taxiOffer1, taxiOffer2, taxiOffer3,
  flightOffer1, flightOffer2, flightOffer3, flightOffer4
};
