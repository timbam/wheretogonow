const cities = require('../database/cities.json');
const _ = require('lodash');
const fs = require('fs');

const filtered = _.uniqBy(cities, '_id');
fs.writeFileSync('fixed.json', JSON.stringify(filtered));