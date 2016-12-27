import React from 'react';
import { GoogleMapLoader, GoogleMap, Marker } from 'react-google-maps';
import { SYMBOLS } from '../database/constants';
import {triggerEvent} from "react-google-maps/lib/utils";

export default (props) => {
  console.log(props.weather);
  const {epicenter} = props.weather;
  const {nearbyCitiesWeather} = props.weather;

  function handleOnClick(e) {
    const coordinates = [e.latLng.lat(), e.latLng.lng()];
    props.findClosestCity(coordinates);
  }

  function onMarkerClick(id) {
    props.onMarkerClick(id);
  }

  return (
    <GoogleMapLoader 
      className="googleMap"
      containerElement={ <div className="googleMap" /> } 
      googleMapElement={
        <GoogleMap 
        onClick={handleOnClick}
        defaultZoom={7} 
        defaultCenter={{lat: epicenter.coordinates[0], lng: epicenter.coordinates[1] }} > 
          {nearbyCitiesWeather.map((city, index) => {
            var {maxTemperature} = city.weatherArray[props.weather.dayIndex];
            return(
              <Marker 
                onClick={() => {onMarkerClick(city._id)}}
                key={index}
                position={{lat: parseFloat(city.weatherArray[0].latitude), lng: parseFloat(city.weatherArray[0].longitude)}}
                defaultAnimation={2}
                icon={"/sym/b48/" + SYMBOLS[Number(city.weatherArray[props.weather.dayIndex].symbol.number)-1] + ".png"}
                label={(index + 1).toString()}
              />
            );
          })}
        </GoogleMap>
      }
    />
  );
}