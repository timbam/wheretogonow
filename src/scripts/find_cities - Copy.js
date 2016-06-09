var yrCitiesRaw = require('./Yrcities.json'),
_ = require('lodash');

var yrCities  = _.uniqBy(yrCitiesRaw, '_id');
var cityQuery = process.argv[2];
var distanceFromCity = 100;
var distanceLon = 3;
var distanceLat = 3;

var citiesFound = search(yrCities, cityQuery);
var firstCity = citiesFound[0];



var lowLon = firstCity.coordinates[1] - distanceLon;
var highLon = firstCity.coordinates[1] + distanceLon;
var lowLat = firstCity.coordinates[0] - distanceLat;
var highLat = firstCity.coordinates[0] + distanceLat;

var coord = [lowLon, highLon, lowLat, highLat];
var citiesByCoord = filterByCoord(yrCities, coord);
var citiesSortedByPopulation = _.orderBy(citiesByCoord, ['population'], ['desc']);

console.log(citiesSortedByPopulation.slice(0,15));

function filterByCoord(source, coord) {
  var results = [];

  results = source.filter(function(entry) {
    return  entry.coordinates[1] < highLon &&
            entry.coordinates[1] > lowLon &&
            entry.coordinates[0] < highLat &&
            entry.coordinates[0] > lowLat;
  });
  return results;
};

function search(source, name) {
    var results = [];

    name = name.toUpperCase();
    results = source.filter(function(entry) {
        return entry.name.toUpperCase().indexOf(name) !== -1;
    });
    return results;
}