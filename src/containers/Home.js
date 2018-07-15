import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators} from 'redux';
import { setIndexToSortBy, findClosestCity, fetchWeather, removeCity, addMap, addEpicenterToState, updateMapCenter } from '../actions/index';
import _ from 'lodash';
import WeatherTable from '../components/WeatherTable';
import GettingStartedGoogleMap from '../components/GettingStartedGoogleMap';

class Home extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    if(typeof this.props.weather.nearbyCitiesWeather[0] != 'undefined'){
      const today = new Date();
      const dateOfData = new Date(this.props.weather.nearbyCitiesWeather[0].weatherArray[0].from);
      if(dateOfData.getTime() + 4e7 < today.getTime()){
        this.props.weather.nearbyCitiesWeather.map(city => this.props.fetchWeather(city))
      }
    }
  }

  filterByDay(index){
    this.props.setIndexToSortBy(index);
  }

  onDoubleClick(coordinates) {
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
      this.props.updateMapCenter(
        [this._mapComponent.getCenter().lat(), this._mapComponent.getCenter().lng()]
      );
    }
  }

  onSingleClick(coordinates){
    this.props.findClosestCity(coordinates).then( () => {
      this.props.addEpicenterToState(this.props.weather.clickedCity);
    });
  }

  render(){
    localStorage.setItem('epicenter', JSON.stringify(this.props.weather.epicenter));
    localStorage.setItem('nearbyCitiesWeather', JSON.stringify(this.props.weather.nearbyCitiesWeather));
    console.log(this.props);
      return(
        <div className="rowYo home">
          <GettingStartedGoogleMap
            className="googleMap"
            containerElement={<div className="googleMap" />}
            mapElement={<div style={{height:`100%`}} />}
            weather={this.props.weather}
            maps = {this.props.maps}
            onCenterChanged={this.onCenterChanged.bind(this)}
            onDoubleClick={this.onDoubleClick.bind(this)}
            onMarkerClick={this.onMarkerClick.bind(this)}
            onMapLoad={this.onMapLoad.bind(this)}
            onSingleClick={this.onSingleClick.bind(this)}
            />
          <WeatherTable weather={this.props.weather} filterByDay={this.filterByDay.bind(this)} />
        </div>
      );
    };
}


function mapStateToProps({ weather, maps }) {
  return { weather, maps };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators( { setIndexToSortBy, findClosestCity, fetchWeather, removeCity, addMap, addEpicenterToState, updateMapCenter }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
