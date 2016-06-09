var fs = require('fs')
  , _ = require('lodash');

var filename = process.argv[2];
if (!filename) {
  console.log('File not found');
  process.exit(1);
}

var cities = fs.readFileSync(filename).toString().split("\n");
cities.pop(); // empty element
var processedCities = _.map(cities, function(city) {
  var data = city.split('\t');
  // var names = data[3].split(',');
  return {
    _id: Number(data[4]),
    name: data[3],
    // alternate_names: _.map(names, function(name) {
    //   return name.toLowerCase();
    // }),
    coordinates: [Number(data[12]), Number(data[13])],
    country_code: String(data[0]),
    country_name: String(data[10]),
    population: Number(data[11]),
    elevation: Number(data[14]),
    typeOfPlace: String(data[7]),
    linkToXML: String(data[17])
  }
});

fs.writeFileSync('Yrcities.json', JSON.stringify(processedCities));