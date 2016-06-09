import axios from 'axios';

export const FETCH_WEATHER = 'FETCH_WEATHER';
export const SEARCH_CITY = 'SEARCH_CITY';
export const INDEX_TO_SEARCH_BY = 'INDEX_TO_SEARCH_BY';
export const FIND_NEARBY_CITIES = 'FIND_NEARBY_CITIES';

export function searchCity(name, numberOfCities) {
  const request = axios.post('/api/search', {
    name: name,
    numberOfCities: numberOfCities
  });
  return {
    type: SEARCH_CITY,
    payload: request
  }
}

export function findNearbyCities(cityObject, radius, numberOfCities) {
  const request = axios.post('/api/findNearbyCities', {
    cityObject: cityObject,
    radius: radius,
    numberOfCities: numberOfCities
  });
  return{
    type: FIND_NEARBY_CITIES,
    payload: request
  };
}

export function fetchWeather(city) {
const request = axios.post('/api/getWeather', {
    coordinates: city.coordinates,
    name: city.name
});
  return {
    type: FETCH_WEATHER,
    payload: request
  }
}

export function setIndexToSortBy(index) {
  return {
    type: INDEX_TO_SEARCH_BY,
    payload: index
  }
}