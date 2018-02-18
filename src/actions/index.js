import axios from 'axios';

export const FETCH_WEATHER = 'FETCH_WEATHER';
export const SEARCH_CITY = 'SEARCH_CITY';
export const INDEX_TO_SEARCH_BY = 'INDEX_TO_SEARCH_BY';
export const FIND_NEARBY_CITIES = 'FIND_NEARBY_CITIES';
export const ADD_EPICENTER = 'ADD_EPICENTER';
export const FIND_CLICKED_CITY = 'FIND_CLICKED_CITY';
export const REMOVE_CITY = 'REMOVE_CITY';
export const ADD_MAP = 'ADD_MAP';

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

export function findClosestCity(coordinates) {
  const request = axios.post('/api/findClosestCity', {
    coordinates: coordinates
  });
  return {
    type: FIND_CLICKED_CITY,
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
    name: city.name,
    id: city._id
});
  return {
    type: FETCH_WEATHER,
    payload: request
  }
}

export function addEpicenterToState(cityObject) {
  return{
    type: ADD_EPICENTER,
    payload: cityObject
  };
}

export function setIndexToSortBy(index) {
  return {
    type: INDEX_TO_SEARCH_BY,
    payload: index
  }
}

export function removeCity(id) {
  return {
    type: REMOVE_CITY,
    payload: id
  }
}

export function addMap(map) {
  return{
    type: ADD_MAP,
    payload: map
  }
}
