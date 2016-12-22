import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators} from 'redux';
import { setIndexToSortBy, findClosestCity, fetchWeather, removeCity } from '../actions/index';
import _ from 'lodash';
import WeatherTable from '../components/WeatherTable';
import GoogleMap from '../components/GoogleMap';

class Home extends React.Component {
  constructor(props) {
    super(props);
  }

  filterByDay(index){
    this.props.setIndexToSortBy(index);
  }

  findClosestCity(coordinates) {
    this.props.findClosestCity(coordinates).then( () => {
      if(!_.find(this.props.weather.nearbyCitiesWeather, {_id: this.props.weather.clickedCity._id})) {
           this.props.fetchWeather(this.props.weather.clickedCity);
      }
    });
  }

  onMarkerClick(id) {
    this.props.removeCity(id);
  }

  render(){
    localStorage.setItem('epicenter', JSON.stringify(this.props.weather.epicenter));
    localStorage.setItem('nearbyCitiesWeather', JSON.stringify(this.props.weather.nearbyCitiesWeather));
    if(this.props.weather.nearbyCitiesWeather.length > 0){
      return(
        <div className="rowYo home">>
          <GoogleMap weather={this.props.weather} findClosestCity={this.findClosestCity.bind(this)} onMarkerClick={this.onMarkerClick.bind(this)} />
          <WeatherTable weather={this.props.weather} filterByDay={this.filterByDay.bind(this)} />
        </div>
      );
    };
    return(
      null
    );
  };
}


function mapStateToProps({ weather }) {
  return { weather };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators( { setIndexToSortBy, findClosestCity, fetchWeather, removeCity }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);