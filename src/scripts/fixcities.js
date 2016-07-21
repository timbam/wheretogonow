const cities = require('./cities.json');
const _ = require('lodash');
const fs = require('fs');

const filtered = _.uniqBy(cities, '_id');
const citiesSortedByPopulation = _.orderBy(filtered, ['population'], ['desc']);
fs.writeFileSync('fixed.json', JSON.stringify(citiesSortedByPopulation));