import _ from 'lodash';
import { SEARCH_CITY, FIND_NEARBY_CITIES, FETCH_WEATHER, INDEX_TO_SEARCH_BY, ADD_EPICENTER, FIND_CLICKED_CITY } from '../actions/index';

const INITIAL_STATE = {
  searchResults: [], 
  nearbyCities: [], 
  nearbyCitiesWeather: JSON.parse(localStorage.getItem('nearbyCitiesWeather')) || [], 
  clickedCity: null, 
  epicenter: JSON.parse(localStorage.getItem('epicenter')) || null, 
  dayIndex: 0 
};

export default function(state = INITIAL_STATE , action) {
  switch (action.type) {
    case SEARCH_CITY:
      return { ...state, searchResults: action.payload.data};
    case FIND_NEARBY_CITIES:
      return { ...state, nearbyCities: action.payload.data, nearbyCitiesWeather: []};
    case FIND_CLICKED_CITY:
      return { ...state, clickedCity: action.payload.data};
    case FETCH_WEATHER:
      var nState = {
        name: action.payload.data.name,
        weatherArray: []
      };
      var previousDate = null;
      var weatherObj = {};
      action.payload.data.weatherdata.product.time.map((item, index) =>{
        var dFrom = new Date(item.from);
        var dTo = new Date (item.to);
        dFrom.setHours(dFrom.getHours() + dFrom.getTimezoneOffset()/60);
        dTo.setHours(dTo.getHours() + dTo.getTimezoneOffset()/60);
        if(previousDate != dFrom.getDate()) {
          if(dFrom.getHours() == 12 && dTo.getHours() == 18 && item.location.maxTemperature) {
            weatherObj = item.location;
            weatherObj.from = dFrom;
            weatherObj.to = dTo;
          }else if(dFrom.getHours() == 12 && dTo.getHours() == 12) {
            if(!weatherObj.maxTemperature){
              weatherObj.maxTemperature = item.location.temperature;
              weatherObj.from = dFrom;
            }
          }else if(dFrom.getHours() == 18 && dTo.getHours() == 18){
            if(!weatherObj.maxTemperature) {
              weatherObj.maxTemperature = item.location.temperature
            }else if(item.location.temperature.value > weatherObj.maxTemperature.value){
              weatherObj.maxTemperature = item.location.temperature
            }
            weatherObj.to = dTo;
          }else if(dFrom.getHours() == 12 && dTo.getHours() == 18 && !(item.location.maxTemperature)) {
            if(!weatherObj.symbol){
              weatherObj.symbol = item.location.symbol;
              weatherObj.from = dFrom;
              weatherObj.to = dTo;
            }; 
          };
          if(weatherObj.symbol && weatherObj.maxTemperature) {
            nState.weatherArray.push(weatherObj);
            weatherObj = {};
            previousDate = dFrom.getDate();
          }
        }
      });
      return { 
        ...state, 
        nearbyCitiesWeather: [ ...state.nearbyCitiesWeather, nState],
        searchResults: [] 
      };
    case ADD_EPICENTER:
      return {...state, epicenter: action.payload};
    case INDEX_TO_SEARCH_BY:
    var nearbyCitiesByWeatherOrdered = _.orderBy(state.nearbyCitiesWeather, ['weatherArray[' + action.payload + '].maxTemperature.value'], ['desc']);
      return { ...state, nearbyCitiesWeather: nearbyCitiesByWeatherOrdered, dayIndex: action.payload};
  }

  return state;
}


