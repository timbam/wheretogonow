import React from 'react';
import { SYMBOLS } from '../database/constants'
import classNames from 'classnames';

export default (props) => {
  function renderDays(weather, index) {
    var buttonClasses = classNames({
      'btn': true,
      'btn-primary': true,
      'btn-outline': true,
      'active': (props.weather.dayIndex == index)
    })
      var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Nov', 'Dec'];
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
      // {numberEnding(dFrom.getDate())} of {months[dFrom.getMonth()]}
      return(
        <th key={index}> 
            <button className={buttonClasses} onClick={() => {props.filterByDay(index)}}>
            {days[dFrom.getDay()]} <br />
            {numberEnding(dFrom.getDate())}
            <span className="caret" ></span></button>
        </th>
      );
  } 
function renderWeather(cityData, index) {
    if(window.innerWidth < 600) {
      var weatherIcon = "/sym/b30/";
    }else {
      var weatherIcon = "sym/b38/";
    }
    const tempArray = cityData.weatherArray.map((weather, index) => {
      if(cityData.weatherArray[index].symbol) {
        var symbolNr = Number(cityData.weatherArray[index].symbol.number);
      };
      return (
        <td key={index}>
        <img src={weatherIcon + SYMBOLS[symbolNr-1] + ".png"}  /><br/>
        {weather.maxTemperature.value.slice(0,weather.maxTemperature.value.indexOf('.'))} °C <br/>
        <span style={{fontSize: '0.95em'}} >{weather.precipitation.value} mm</span>
        </td>
      );
    });
    return(
        <tr key={index}>
          <th className="tdCityName">{cityData.name} <br/>
          {index + 1}
          </th>
          {tempArray}
        </tr>
    );
}
  return(
      <div className="weatherTable" >
        <table className="table table-hover table-s table-sm"> 
         <thead>
          <tr>
            <th className="tdCityName" >City</th>
            {props.weather.nearbyCitiesWeather[0].weatherArray.map(renderDays)}
          </tr>
         </thead>
          <tbody>
            {props.weather.nearbyCitiesWeather.map(renderWeather)}
          </tbody>
        </table>
      </div>
  );
}


