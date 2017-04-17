import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators} from 'redux';
import { setIndexToSortBy, findClosestCity, fetchWeather, removeCity, addMap, addEpicenterToState } from '../actions/index';
import _ from 'lodash';
import WeatherTable from '../components/WeatherTable';
import GettingStartedGoogleMap from '../components/GettingStartedGoogleMap';

class Home extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    if(typeof this.props.weather.nearbyCitiesWeather[0] != 'undefined'){
      var today = new Date();
      var dateOfData = new Date(this.props.weather.nearbyCitiesWeather[0].weatherArray[0].from);
      if(dateOfData.getTime() + 4e7 < today.getTime()){
        this.props.weather.nearbyCitiesWeather.map(city => this.props.fetchWeather(city))
      }
    }
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
  onMapLoad(map){
    if(map){
      this._mapComponent = map;
    }
  }

  onCenterChanged(){
    if(this._mapComponent){
      this.props.addEpicenterToState({
        coordinates: [this._mapComponent.getCenter().lat(), this._mapComponent.getCenter().lng()]
      });
    }
  }


  render(){
    localStorage.setItem('epicenter', JSON.stringify(this.props.weather.epicenter));
    localStorage.setItem('nearbyCitiesWeather', JSON.stringify(this.props.weather.nearbyCitiesWeather));
    if(this.props.weather.nearbyCitiesWeather.length > 0){
      return(
        <div className="rowYo home">
          <GettingStartedGoogleMap
            className="googleMap"
            containerElement={<div className="googleMap" />}
            mapElement={<div style={{height:`100%`}} />}
            weather={this.props.weather}
            onCenterChanged={this.onCenterChanged.bind(this)}
            findClosestCity={this.findClosestCity.bind(this)}
            onMarkerClick={this.onMarkerClick.bind(this)}
            onMapLoad={this.onMapLoad.bind(this)}
            />
          <WeatherTable weather={this.props.weather} filterByDay={this.filterByDay.bind(this)} />
        </div>
      );
    };
    return(
      <div className="rowYo home">
        <GettingStartedGoogleMap
          className="googleMap"
          containerElement={<div className="googleMap" />}
          mapElement={<div style={{height:`100%`}} />}
          weather={this.props.weather}
          onCenterChanged={this.onCenterChanged.bind(this)}
          findClosestCity={this.findClosestCity.bind(this)}
          onMarkerClick={this.onMarkerClick.bind(this)}
          onMapLoad={this.onMapLoad.bind(this)}
          />
      </div>
    );
  };
}


function mapStateToProps({ weather }) {
  return { weather };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators( { setIndexToSortBy, findClosestCity, fetchWeather, removeCity, addMap, addEpicenterToState }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
