_ = require("lodash");
var yrCitiesRaw = require("./Yrcities.json");

function filterByCoord(source, coord) {
  var results = [];

  results = source.filter(function(entry) {
    return (
      entry.coordinates[1] < highLon &&
      entry.coordinates[1] > lowLon &&
      entry.coordinates[0] < highLat &&
      entry.coordinates[0] > lowLat
    );
  });
  return results;
}

export default function FindCities(cityObject, radius, numberOfCities) {
  var yrCities = _.uniqBy(yrCitiesRaw, "_id");
  var distanceLat = radius;
  var distanceLon = radius;

  var lowLon = cityObject.coordinates[1] - distanceLon;
  var highLon = cityObject.coordinates[1] + distanceLon;
  var lowLat = cityObject.coordinates[0] - distanceLat;
  var highLat = cityObject.coordinates[0] + distanceLat;
  var coord = [lowLon, highLon, lowLat, highLat];

  // Find all cities close to cityObject and filter them by population
  var citiesByCoord = filterByCoord(yrCities, coord);
  var citiesSortedByPopulation = _.orderBy(
    citiesByCoord,
    ["population"],
    ["desc"]
  );

  // Return an array of city objects
  return citiesSortedByPopulation.slice(0, numberOfCities);
}
