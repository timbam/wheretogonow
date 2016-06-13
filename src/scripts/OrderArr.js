const cities = require('../database/cities.json');
const _ = require('lodash');

var name = 'PAU';
results = cities.filter(function(entry) {
    return entry.name.toUpperCase().indexOf(name) !== -1;
});
var sortedResults = _.sortBy(results, function(o) {
  return o.name.length;
});

console.log(sortedResults); 