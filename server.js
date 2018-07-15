"use strict";
// Babel ES6/JSX Compiler
require('babel-register');

const express = require('express');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
const app = express();
// yr.no stuff
const yrno = require('yr.no-interface')({
  request: {
    timeout: 25000
  }
});
const LOC_VER = 1.3;
const xml2js = require('xml2js');
const cities = require('./src/database/cities15000.json');
const cities_1000 = require('./src/database/cities1000.json');
const _ = require('lodash');
const myFunctions = require('./src/scripts/myFunctions');

app.set('port', process.env.PORT || 3000);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/getWeather', function(req, res) {
  const coordinates = req.body.coordinates;
  const cityName = req.body.name;
  const id = req.body.id;
  yrno.locationforecastlts({
    query: {
      lat: coordinates[0],
      lon: coordinates[1]
    },
    version: LOC_VER
  }, function(err, xml) {
    if(err){
      console.log(err);
    }else{
      new xml2js.Parser({
        async: true,
        mergeAttrs: true,
        explicitArray: false
      }).parseString(xml, function(err, json) {
        json.name = cityName;
        json._id = id;
        json.coordinates = coordinates;
        res.send(json);
      });
    }
  });
});


app.post('/api/search', function(req, res) {
    let name = req.body.name;
    if(name == "") res.send([]);
    const numberOfCities = req.body.numberOfCities;
    let results = [];
    name = name.toUpperCase();
    results = cities.filter(function(entry) {
        return entry.name.toUpperCase().indexOf(name) !== -1;
    });
    let sortedResults = _.sortBy(results, function(o) {
      return o.name.length;
    });
    res.send(sortedResults.slice(0, numberOfCities));
})

app.post('/api/findClosestCity', function(req, res) {
  const coordinates = req.body.coordinates;

  function nearestCity(coordinates){
    const cities = cities_1000;
    let minDist = 1000;
    let objToReturn = {}, dist;
    for(let city of cities){
      dist = myFunctions.distance(coordinates[0],coordinates[1], city.coordinates[0], city.coordinates[1]);
      if(dist < minDist) {
          minDist = dist;
          objToReturn = city;
      }
      if(dist < 2) {
          break;
      }
    }
    return objToReturn;
  }
  res.send(nearestCity(coordinates));
})

app.post('/api/findNearbyCities', function(req, res) {
  const cityObject = req.body.cityObject;
  const radius = req.body.radius;
  const numberOfCities = req.body.numberOfCities;
  function filterByCoord(source, coord, radius, numberOfCities) {
    let results = [];
    results = source.filter(function(entry) {
      var dist = myFunctions.distance(coord[0], coord[1], entry.coordinates[0], entry.coordinates[1]);
      return  50 < dist && dist < radius;
    });
    let deCluster = [];
    let j = 0;
    while (deCluster.length < numberOfCities && j < results.length) {
        let addItem = true;
        if(j == 0) {
          deCluster.push(results[0]);
        } else {
          for(let i = 0; i < deCluster.length; i++) {
            if(myFunctions.distance(results[j].coordinates[0], results[j].coordinates[1], deCluster[i].coordinates[0], deCluster[i].coordinates[1]) < 50) {
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
    const coord = [cityObject.coordinates[0], cityObject.coordinates[1]];
  // Find all cities close to cityObject and filter them by coordinates
    const citiesByCoord = filterByCoord(cities, coord, radius, numberOfCities);
    const largestCities = citiesByCoord.slice(0, numberOfCities)
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
  res.sendFile(path.join(__dirname, 'views/index.html'));
});

app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});
