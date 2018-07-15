import { combineReducers } from 'redux';
import WeatherReducer from './reducer_weather';
import MapsReducer from './reducer_maps';

const rootReducer = combineReducers({
  weather: WeatherReducer,
  maps: MapsReducer
});

export default rootReducer;
