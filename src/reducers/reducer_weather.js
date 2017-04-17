import _ from 'lodash';
import { SEARCH_CITY, FIND_NEARBY_CITIES, FETCH_WEATHER, INDEX_TO_SEARCH_BY, ADD_EPICENTER, FIND_CLICKED_CITY, REMOVE_CITY } from '../actions/index';

const INITIAL_STATE ={
  searchResults: [],
  nearbyCities: [],
  nearbyCitiesWeather: JSON.parse(localStorage.getItem('nearbyCitiesWeather')) || [],
  clickedCity: null,
  epicenter: JSON.parse(localStorage.getItem('epicenter')) || {coordinates: [48.8, 2.35]},
  dayIndex: 0,
  map: {}
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
    console.log(action.payload.data);
    // Creating a new city-object with weather
      var nState = {
        name: action.payload.data.name,
        _id: action.payload.data._id,
        coordinates: action.payload.data.coordinates,
        weatherArray: []
      };
      // Checking if the city is already in the state. If it is, it's deleted so that it won't get duplicated.
      var index = state.nearbyCitiesWeather.map(function(x) {return x._id; }).indexOf(nState._id);
      if(index > -1){
        var newArray = state.nearbyCitiesWeather.slice(0,index).concat(state.nearbyCitiesWeather.slice(index+1));
      }else {
        var newArray = state.nearbyCitiesWeather;
      }
      // Taking weatherdata from the payload, rearranging etc..
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
            }
            if(item.location.precipitation) {
              weatherObj.precipitation = item.location.precipitation;
            }
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
        nearbyCitiesWeather: [ ...newArray, nState].slice(0,9),
        searchResults: []
      };
    case REMOVE_CITY:
        const reducedArray =  state.nearbyCitiesWeather.filter(city=> city._id !== action.payload);
        return {...state, nearbyCitiesWeather: reducedArray };
    case ADD_EPICENTER:
      return {...state, epicenter: action.payload};
    case INDEX_TO_SEARCH_BY:
      var nearbyCitiesByWeatherOrdered = _.orderBy(state.nearbyCitiesWeather, ['weatherArray[' + action.payload + '].maxTemperature.value'], ['desc']);
      return { ...state, nearbyCitiesWeather: nearbyCitiesByWeatherOrdered, dayIndex: action.payload};
  }

  return state;
}
