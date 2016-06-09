// Babel ES6/JSX Compiler
require('babel-register');

var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var reactCookie = require('react-cookie');
var app = express();
// yr.no stuff
var yrno = require('yr.no-interface'),
LOC_VER = 1.2;
var xml2js = require('xml2js');
var cities = require('./src/database/cities.json');
var _ = require('lodash');

app.set('port', process.env.PORT || 3000);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/getWeather', function(req, res) {
  var coordinates = req.body.coordinates;
  var cityName = req.body.name;
  yrno.locationforecastlts({
    lat: coordinates[0],
    lon: coordinates[1]
  }, LOC_VER, function(err, xml) {
    if(err) console.log(err);
    new xml2js.Parser({
      async: true,
      mergeAttrs: true,
      explicitArray: false
    }).parseString(xml, function(err, json) {
        json.name = cityName;
        res.send(json);
      });     
  });
});

app.post('/api/search', function(req, res) {
    var name = req.body.name;
    var numberOfCities = req.body.numberOfCities;
    var results = [];
    name = name.toUpperCase();
    results = cities.filter(function(entry) {
        return entry.name.toUpperCase().indexOf(name) !== -1;
    });
    res.send(results.slice(0, numberOfCities));
})

app.post('/api/findNearbyCities', function(req, res) {
  var cityObject = req.body.cityObject;
  var radius = req.body.radius;
  var numberOfCities = req.body.numberOfCities;
function filterByCoord(source, coord) {
  var results = [];

  results = source.filter(function(entry) {
    return  entry.coordinates[1] > coord[0] &&
            entry.coordinates[1] < coord[1] &&
            entry.coordinates[0] > coord[2] &&
            entry.coordinates[0] < coord[3];
  });
  return results;
};
function FindCities(cityObject, radius, numberOfCities) {
  var distanceLat = radius/111; // 111km/degree so we divide by 111 to get lateral degrees  
  var distanceLon = Math.abs(radius/(Math.PI*6378*Math.cos(cityObject.coordinates[0]*Math.PI/180)/180));
  var lowLon = cityObject.coordinates[1] - distanceLon;
  var highLon = cityObject.coordinates[1] + distanceLon;
  var lowLat = cityObject.coordinates[0] - distanceLat;
  var highLat = cityObject.coordinates[0] + distanceLat;
  var coord = [lowLon, highLon, lowLat, highLat];

// Find all cities close to cityObject and filter them by population
  var citiesByCoord = filterByCoord(cities, coord);
  var citiesSortedByPopulation = _.orderBy(citiesByCoord, ['population'], ['desc']);

// Return an array of city objects
  return citiesSortedByPopulation.slice(0, numberOfCities);
};
res.send(FindCities(cityObject, radius, numberOfCities));

})

// other requests
app.get('*', function (req, res) {
  reactCookie.plugToRequest(req, res);
  res.sendFile(path.join(__dirname, 'views/index.html'));
});

app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});