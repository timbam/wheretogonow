import _ from "lodash";
import {
  SEARCH_CITY,
  FIND_NEARBY_CITIES,
  FETCH_WEATHER,
  INDEX_TO_SEARCH_BY,
  ADD_EPICENTER,
  FIND_CLICKED_CITY,
  REMOVE_CITY,
  UPDATE_MAP_CENTER
} from "../actions/index";
import { paris } from "../database/constants";

const mapCenter = JSON.parse(localStorage.getItem("epicenter"))
  ? JSON.parse(localStorage.getItem("epicenter")).coordinates
  : paris.coordinates;

const INITIAL_STATE = {
  mapCenter: mapCenter,
  searchResults: [],
  nearbyCities: [],
  nearbyCitiesWeather:
    JSON.parse(localStorage.getItem("nearbyCitiesWeather")) || [],
  clickedCity: null,
  epicenter: JSON.parse(localStorage.getItem("epicenter")) || paris,
  dayIndex: 0,
  map: {}
};

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case UPDATE_MAP_CENTER:
      return { ...state, mapCenter: action.payload };
    case SEARCH_CITY:
      return { ...state, searchResults: action.payload.data };
    case FIND_NEARBY_CITIES:
      return {
        ...state,
        nearbyCities: action.payload.data,
        nearbyCitiesWeather: []
      };
    case FIND_CLICKED_CITY:
      return { ...state, clickedCity: action.payload.data };
    case FETCH_WEATHER:
      // Checking if the city is already in the state. If it is, delete it so that it won't get duplicated.
      const index = state.nearbyCitiesWeather
        .map(function(x) {
          return x._id;
        })
        .indexOf(action.payload.data._id);
      const newArray =
        index > -1
          ? state.nearbyCitiesWeather
              .slice(0, index)
              .concat(state.nearbyCitiesWeather.slice(index + 1))
          : state.nearbyCitiesWeather;

      const nState = createNewWeatherObject(action.payload.data);

      return {
        ...state,
        nearbyCitiesWeather: [...newArray, nState].slice(0, 9),
        searchResults: []
      };
    case REMOVE_CITY:
      const reducedArray = state.nearbyCitiesWeather.filter(
        city => city._id !== action.payload
      );
      return { ...state, nearbyCitiesWeather: reducedArray };
    case ADD_EPICENTER:
      return {
        ...state,
        epicenter: action.payload,
        mapCenter: action.payload.coordinates
      };
    case INDEX_TO_SEARCH_BY:
      let nearbyCitiesByWeatherOrdered = _.orderBy(
        state.nearbyCitiesWeather,
        ["weatherArray[" + action.payload + "].weatherRating"],
        ["asc"]
      );
      return {
        ...state,
        nearbyCitiesWeather: nearbyCitiesByWeatherOrdered,
        dayIndex: action.payload
      };
  }

  return state;
}

function createNewWeatherObject(pData) {
  // Taking weatherdata from the payload, rearranging etc..
  let weatherArray = [];
  let previousDate = null;
  let weatherObj = {};
  pData.weatherdata.product.time.map((item, index) => {
    let dFrom = new Date(item.from);
    let dTo = new Date(item.to);
    dFrom.setHours(dFrom.getHours() + dFrom.getTimezoneOffset() / 60);
    dTo.setHours(dTo.getHours() + dTo.getTimezoneOffset() / 60);
    if (previousDate != dFrom.getDate()) {
      if (
        dFrom.getHours() == 12 &&
        dTo.getHours() == 18 &&
        item.location.maxTemperature
      ) {
        weatherObj = item.location;
        weatherObj.from = dFrom;
        weatherObj.to = dTo;
      } else if (dFrom.getHours() == 12 && dTo.getHours() == 12) {
        if (!weatherObj.maxTemperature) {
          weatherObj.maxTemperature = item.location.temperature;
          weatherObj.from = dFrom;
        }
      } else if (dFrom.getHours() == 18 && dTo.getHours() == 18) {
        if (!weatherObj.maxTemperature) {
          weatherObj.maxTemperature = item.location.temperature;
        } else if (
          item.location.temperature.value > weatherObj.maxTemperature.value
        ) {
          weatherObj.maxTemperature = item.location.temperature;
        }
        weatherObj.to = dTo;
      } else if (
        dFrom.getHours() == 12 &&
        dTo.getHours() == 18 &&
        !item.location.maxTemperature
      ) {
        if (!weatherObj.symbol) {
          weatherObj.symbol = item.location.symbol;
          weatherObj.from = dFrom;
          weatherObj.to = dTo;
        }
        if (item.location.precipitation) {
          weatherObj.precipitation = item.location.precipitation;
        }
      }
      //Create weatherRating: The lower WeatherRating is, the better is the weather, includes temperature, symbolnr and precipitation
      if (weatherObj.symbol && weatherObj.maxTemperature) {
        if (weatherObj.maxTemperature.value)
          weatherObj.maxTemperature.value = Number(
            weatherObj.maxTemperature.value
          );
        weatherObj.weatherRating = 0;
        if (weatherObj.symbol.number && Number(weatherObj.symbol.number) <= 4)
          weatherObj.weatherRating = Number(weatherObj.symbol.number) - 1;
        weatherObj.weatherRating += Math.abs(
          26 - weatherObj.maxTemperature.value
        );
        if (weatherObj.precipitation)
          weatherObj.weatherRating +=
            Number(weatherObj.precipitation.value) * 15;
        weatherArray.push(weatherObj);
        weatherObj = {};
        previousDate = dFrom.getDate();
      }
    }
  });
  // Creating a new city-object with weather
  return {
    //nState
    name: pData.name,
    _id: pData._id,
    coordinates: pData.coordinates,
    weatherArray
  };
}
