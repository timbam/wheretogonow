import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators} from 'redux';
import { searchCity, findNearbyCities, fetchWeather, setIndexToSortBy } from '../actions/index';
import _ from 'lodash';
import ReactSlider from 'react-slider';

class SearchBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = { term: '', radius: 300, numberOfCities: 8};
    this.onInputChange = this.onInputChange.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.onSetIndexToSortBy = this.onSetIndexToSortBy.bind(this);
  }

  onInputChange(event) {
    this.setState({ term: event.target.value });
    this.props.searchCity(event.target.value, 10);
  }

  onFormSubmit(event) {
    event.preventDefault();
    // Fetch weather data
    // this.setState({ term: ''});
  }

  onfetchWeather(cityObject) {
    this.setState({term: ''});
    this.props.findNearbyCities(cityObject, this.state.radius, this.state.numberOfCities).then(() =>
      this.props.weather.nearbyCities.map(city => this.props.fetchWeather(city))
    );
  }

  onSetIndexToSortBy(index) {
    this.props.setIndexToSortBy(index);
  }

  render(){
    var searchResults = this.props.weather.searchResults.map(item => {
      return(
        <div key={item._id} >
          <button onClick={this.onfetchWeather.bind(this, item)} className="btn-link">{item.name} ({item.country_code})</button>
        </div>
      );
    });
    return(
      <div>
      <form onSubmit={this.onFormSubmit} className="input-group">
        <input 
        placeholder="Where are you now?"
        className="form-control"
        value={this.state.term}
        onChange={this.onInputChange} 
        />
{/*        <span className="input-group-btn">
          <button type="submit" className="btn btn-secondary">Submit</button>
        </span>*/}
      </form>
      <input type="range" min="100" max="600" value={this.state.radius} onChange={(e) => this.setState({radius: e.target.value})} />
      <h6>Radius: {this.state.radius}</h6>
      <input type="range" min="3" max="12" value={this.state.numberOfCities} onChange={(e) => this.setState({numberOfCities:e.target.value})} />
      <h6>Number of cities to search for: {this.state.numberOfCities}</h6>
        {/*<button onClick={this.onSetIndexToSortBy(50)} > Set Index </button>*/}
        {this.props.weather.searchResults.length > 1 ? searchResults : null}
      </div>
    );
  }
}
function mapStateToProps({ weather }) {
  return { weather };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ searchCity, findNearbyCities, fetchWeather, setIndexToSortBy }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchBar);