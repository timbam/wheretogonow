import { combineReducers } from 'redux';
import WeatherReducer from './reducer_weather';
import MapReducer from './reducer_map';

const rootReducer = combineReducers({
  weather: WeatherReducer,
  map: MapReducer
});

export default rootReducer;
