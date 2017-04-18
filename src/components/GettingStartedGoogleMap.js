import React from 'react';
import { withGoogleMap, GoogleMap, Marker } from 'react-google-maps';
import { SYMBOLS } from '../database/constants';

const GettingStartedGoogleMap = withGoogleMap(props => {
  // console.log(props.weather);
  let centerChangedTimeout;
  const {epicenter} = props.weather;
  const {nearbyCitiesWeather} = props.weather;

  function handleOnClick(e) {
    const coordinates = [e.latLng.lat(), e.latLng.lng()];
    props.findClosestCity(coordinates);
  }

  function onCenterChanged(){
    if(centerChangedTimeout){
      clearTimeout(centerChangedTimeout);
      centerChangedTimeout = null;
    }
    centerChangedTimeout = setTimeout(props.onCenterChanged, 100);
  }

  return (
        <GoogleMap
        ref={props.onMapLoad}
        onClick={handleOnClick}
        onCenterChanged={onCenterChanged}
        defaultZoom={7}
        center={{lat: epicenter.coordinates[0], lng: epicenter.coordinates[1] }} >
          {nearbyCitiesWeather.map((city, index) => {
            var {maxTemperature} = city.weatherArray[props.weather.dayIndex];
            return(
              <Marker
                onClick={() => {props.onMarkerClick(city._id)}}
                key={index}
                position={{lat: parseFloat(city.weatherArray[0].latitude), lng: parseFloat(city.weatherArray[0].longitude)}}
                defaultAnimation={2}
                icon={"/sym/b48/" + SYMBOLS[Number(city.weatherArray[props.weather.dayIndex].symbol.number)-1] + ".png"}
                label={(index + 1).toString()}
              />
            );
          })
        }
        </GoogleMap>
  );
});
export default GettingStartedGoogleMap;
