import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators} from 'redux';
import { setIndexToSortBy } from '../actions/index';
import _ from 'lodash';
import { SYMBOLS } from '../database/constants.js'

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.renderDays = this.renderDays.bind(this);
    this.renderWeather = this.renderWeather.bind(this);
  }

  filterByDay(index){
    this.props.setIndexToSortBy(index);
  }

  renderDays(weather, index) {
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'November', 'December'];
    var dFrom = new Date(weather.from);
    // 
    var numberEnding = function(date){
      switch (date) {
        case 1: return date + 'st';
        case 2: return date + 'nd';
        case 3: return date + 'rd';
        default: return date + 'th';
      };
    };
    return(
      <th key={index}> 
          <button className="btn btn-default" onClick={() => {this.filterByDay(index)}}>
          {days[dFrom.getDay()]} <br />
          {numberEnding(dFrom.getDate())} of {months[dFrom.getMonth()]}  
          <span className="caret" ></span></button>
      </th>
    );
  }

  renderWeather(cityData, index) {
    const tempArray = cityData.weatherArray.map((weather, index) => {
      if(cityData.weatherArray[index].symbol) {
        var symbolNr = Number(cityData.weatherArray[index].symbol.number);
      };
      return (
        <td key={index}>
        <img src={"/sym/b38/" + SYMBOLS[symbolNr-1] + ".png"}  /><br/>
        {weather.maxTemperature.value} °C</td>
      );
    });
    return(
        <tr key={index}>
          <td>{cityData.name}</td>
          {tempArray}
        </tr>
    );
  }

  render(){
    if(this.props.weather.nearbyCitiesWeather.length > 0){
      return(
        <div>
          <table className="table table-hover">
            <thead>
              <tr>
                <th>City</th>
                {this.props.weather.nearbyCitiesWeather[0].weatherArray.map(this.renderDays)}
              </tr>
            </thead>
            <tbody>
              {this.props.weather.nearbyCitiesWeather.map(this.renderWeather)}
            </tbody>
          </table>
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