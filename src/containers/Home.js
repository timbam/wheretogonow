import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators} from 'redux';
import { setIndexToSortBy } from '../actions/index';
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

  render(){
    if(this.props.weather.nearbyCitiesWeather.length > 0){
      return(
        <div className="row">
          <GoogleMap weather={this.props.weather} />
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
  return bindActionCreators( { setIndexToSortBy }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);