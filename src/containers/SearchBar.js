import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators} from 'redux';
import { searchCity, findNearbyCities, fetchWeather, setIndexToSortBy, addEpicenterToState } from '../actions/index';
import _ from 'lodash';
import ReactSlider from 'react-slider';
import classNames from 'classnames';

class SearchBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = { term: '', radius: 300, numberOfCities: 5, isHidden: false, isBlurred: false};
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
  }

  onfetchWeather(cityObject) {
    this.setState({term: ''});
    this.props.addEpicenterToState(cityObject);
    this.props.findNearbyCities(cityObject, this.state.radius, this.state.numberOfCities).then(() =>
      this.props.weather.nearbyCities.map(city => this.props.fetchWeather(city))
    );
  }

  onSetIndexToSortBy(index) {
    this.props.setIndexToSortBy(index);
  }

  onHide() {
    if(this.state.isHidden){
      this.setState({isHidden: false});
    }else {
      this.setState({isHidden: true});
    }
  }

  onBlurInput() {
    this.setState({isBlurred: true});
  }
  onFocusInput() {
    this.setState({isBlurred: false})
  }

  render(){
    var sResultsClasses = classNames({
        'searchResults': true,
         'col-lg-12': true,
         'isHid': !(this.state.term.length > 0) || this.state.isBlurred
    });
    var hiddenClass = classNames({
      'isHid': (this.state.isHidden)
    })
    var searchResults = this.props.weather.searchResults.map(item => {
      return(
        <div key={item._id} >
          <button onClick={this.onfetchWeather.bind(this, item)} className="btn btn-default">{item.name} ({item.country_code})</button>
        </div>
      );
    });
    return(
      <div className="SearchBar rowYo">
      <button className="hideButton" onClick={this.onHide.bind(this)}>{this.state.isHidden ? 'Show' : 'Hide'} <span className="glyphicon glyphicon-chevron-down"></span></button>
        <div className={hiddenClass}>
          <form onSubmit={this.onFormSubmit} className="input-group col-lg-12">
            <input 
            placeholder="Where are you now?"
            className="form-control"
            value={this.state.term}
            onChange={this.onInputChange}  
            onBlur={this.onBlurInput.bind(this)}
            onFocus={this.onFocusInput.bind(this)}
            />
          </form>
          <div className={sResultsClasses} >
            {this.props.weather.searchResults.length > 0 ? searchResults : null}
          </div>
          <div className="radiusBox rBoxes" >
            <p>Radius: <span className="rangeTitles" >{this.state.radius} </span>km</p>
            <input type="range" min="100" max="600" value={this.state.radius} onChange={(e) => this.setState({radius: e.target.value})} />
          </div>
          <div className="rangeBox rBoxes" >
            <p>Number of cities: <span className="rangeTitles">{this.state.numberOfCities}</span></p>
            <input type="range" min="1" max="9" value={this.state.numberOfCities} onChange={(e) => this.setState({numberOfCities:e.target.value})} />
          </div>
        </div>
      </div>
    );
  }
}
function mapStateToProps({ weather }) {
  return { weather };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ searchCity, findNearbyCities, fetchWeather, setIndexToSortBy, addEpicenterToState }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchBar);