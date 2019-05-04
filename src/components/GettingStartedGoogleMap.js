import React from "react";
import { withGoogleMap, GoogleMap, Marker, Circle } from "react-google-maps";
import { SYMBOLS } from "../database/constants";

const GettingStartedGoogleMap = withGoogleMap(props => {
  // console.log(props.weather);
  let centerChangedTimeout, singleClickTimeout;
  const { mapCenter, epicenter } = props.weather;
  const { nearbyCitiesWeather } = props.weather;

  function handleDblClick(e) {
    clearTimeout(singleClickTimeout);
    const coordinates = [e.latLng.lat(), e.latLng.lng()];
    props.onDoubleClick(coordinates);
  }

  function handleSingleClick(e) {
    singleClickTimeout = setTimeout(function() {
      const coordinates = [e.latLng.lat(), e.latLng.lng()];
      props.onSingleClick(coordinates);
    }, 300);
  }

  function onCenterChanged() {
    if (centerChangedTimeout) {
      clearTimeout(centerChangedTimeout);
      centerChangedTimeout = null;
    }
    centerChangedTimeout = setTimeout(props.onCenterChanged, 100);
  }

  function EpicenterRender() {
    if (epicenter) {
      return (
        <div>
          <Circle
            center={{
              lat: epicenter.coordinates[0],
              lng: epicenter.coordinates[1]
            }}
            radius={props.maps.circleRadius * 1000} //Convert km to m
            visible={props.maps.circleVisible}
            options={{
              fillColor: "blue",
              strokeColor: "#269abc",
              strokeOpacity: 0.75,
              fillOpacity: 0
            }}
          />
        </div>
      );
    }
    return null;
  }
  return (
    <GoogleMap
      ref={props.onMapLoad}
      onDblClick={handleDblClick}
      onClick={handleSingleClick}
      onCenterChanged={onCenterChanged}
      defaultZoom={6}
      options={{
        disableDoubleClickZoom: true,
        mapTypeControl: false,
        streetViewControl: false
      }}
      center={{ lat: mapCenter[0], lng: mapCenter[1] }}
    >
      {nearbyCitiesWeather.map((city, index) => {
        var { maxTemperature } = city.weatherArray[props.weather.dayIndex];
        return (
          <Marker
            onClick={() => {
              props.onMarkerClick(city._id);
            }}
            key={index}
            position={{
              lat: parseFloat(city.weatherArray[0].latitude),
              lng: parseFloat(city.weatherArray[0].longitude)
            }}
            defaultAnimation={2}
            icon={
              "/sym/b48/" +
              SYMBOLS[
                Number(
                  city.weatherArray[props.weather.dayIndex].symbol.number
                ) - 1
              ] +
              ".png"
            }
            label={(index + 1).toString()}
          />
        );
      })}
      <EpicenterRender />
    </GoogleMap>
  );
});
export default GettingStartedGoogleMap;
