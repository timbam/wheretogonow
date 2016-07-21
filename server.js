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
    var sortedResults = _.sortBy(results, function(o) {
      return o.name.length;
    });
    res.send(sortedResults.slice(0, numberOfCities));
})

app.post('/api/findNearbyCities', function(req, res) {
  var cityObject = req.body.cityObject;
  var radius = req.body.radius;
  var numberOfCities = req.body.numberOfCities;
  function distance(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = (lat2 - lat1) * Math.PI / 180;  // deg2rad below
    var dLon = (lon2 - lon1) * Math.PI / 180;
    var a = 
       0.5 - Math.cos(dLat)/2 + 
       Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
       (1 - Math.cos(dLon))/2;
    return R * 2 * Math.asin(Math.sqrt(a));
  }
  function filterByCoord(source, coord, radius, numberOfCities) {
    var results = [];
    results = source.filter(function(entry) {
      var dist = distance(coord[0], coord[1], entry.coordinates[0], entry.coordinates[1]);
      return  50 < dist && dist < radius;
    });
    var deCluster = [];
    var j = 0;
    while (deCluster.length < numberOfCities && j < results.length) {
        var addItem = true;
        if(j == 0) {
          deCluster.push(results[0]);
        } else {
          for(var i = 0; i < deCluster.length; i++) {
            if(distance(results[j].coordinates[0], results[j].coordinates[1], deCluster[i].coordinates[0], deCluster[i].coordinates[1]) < 50) {
              addItem = false;
            }else if((i == deCluster.length - 1) && (addItem == true)) {
              deCluster.push(results[j]);
            }
          }
        }
        j++;
    }
    return deCluster;
  };
  function FindCities(cityObject, radius, numberOfCities) {
    var coord = [cityObject.coordinates[0], cityObject.coordinates[1]];
  // Find all cities close to cityObject and filter them by coordinates
    var citiesByCoord = filterByCoord(cities, coord, radius, numberOfCities);
    var largestCities = citiesByCoord.slice(0, numberOfCities)
  // Return an array of city objects, including the cityObject
  function FindInArray(array, obj){
    for(var i = 0; i < array.length; i++) {
      if(obj.name == array[i].name){
        return true;
      }else if(i == (array.length - 1)){
        return false;
      };
    };
  };
    if(!FindInArray(largestCities, cityObject)){
      largestCities[largestCities.length - 1] = cityObject;
      return largestCities;
    }else {
      return largestCities;
    }
  };
res.send(FindCities(cityObject, radius, numberOfCities));
});

// other requests
app.get('*', function (req, res) {
  reactCookie.plugToRequest(req, res);
  res.sendFile(path.join(__dirname, 'views/index.html'));
});

app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});