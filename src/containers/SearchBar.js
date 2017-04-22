import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators} from 'redux';
import { searchCity, findNearbyCities, fetchWeather, setIndexToSortBy, addEpicenterToState } from '../actions/index';
import _ from 'lodash';
import Slider from 'rc-slider';
import classNames from 'classnames';

class SearchBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = { term: '', radius: 300, numberOfCities: 5, isHidden: false, isBlurred: false, btnFocused: false, btnID: -1};
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
    this.setState({
      term: '',
      btnID: -1
    });
    console.log(cityObject);
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
  onBlurSearchResults(){
    this.setState({
      btnFocused: false
    });
  }
  onArrowUpOrDown(newId){
    var btn = this.refs['button' + newId];
    console.log(btn);
    if(!btn){
      this.refs.inputForm.focus();
      this.setState({
        btnID: -1
      });
      return;
    }
    btn.focus();
    this.setState({
      btnFocused: true,
      btnID: newId
    });
  }
  onKeyDown(e) {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        this.onArrowUpOrDown(this.state.btnID + 1);
        break;
      case "ArrowUp":
        e.preventDefault();
        this.onArrowUpOrDown(this.state.btnID - 1);
        break;
      case "Enter":
        if(this.props.weather.searchResults[this.state.btnID]){
          this.onfetchWeather(this.props.weather.searchResults[this.state.btnID]);
        }
      break;
      case "Escape":
        this.setState({
          btnFocused: false
        });
      default:

    }
  }

  render(){
    var sResultsClasses = classNames({
        'searchResults': true,
         'col-lg-12': true,
         'isHid': !(this.state.term.length > 0) || (this.state.isBlurred && !this.state.btnFocused)
    });
    var hiddenClass = classNames({
      'isHid': (this.state.isHidden)
    })
    var searchResults = this.props.weather.searchResults.map((item, index) => {
      return(
        <div key={item._id} >
          <button ref={"button" + index}
            onKeyDown={this.onKeyDown.bind(this)}
            onMouseDown={this.onfetchWeather.bind(this, item)}
            className="btn btn-default">{item.name} ({item.country_code})
          </button>
        </div>
      );
    });
    return(
      <div className="SearchBar rowYo">
      <button className="hideButton" onClick={this.onHide.bind(this)}>{this.state.isHidden ? 'Show' : 'Hide'} <span className="glyphicon glyphicon-chevron-down"></span></button>
        <div className={hiddenClass}>
          <form onSubmit={this.onFormSubmit} className="input-group col-lg-12">
            <input
            ref="inputForm"
            placeholder="Where are you now?"
            className="form-control"
            value={this.state.term}
            onChange={this.onInputChange}
            onFocus={this.onFocusInput.bind(this)}
            onBlur={this.onBlurInput.bind(this)}
            onKeyDown={this.onKeyDown.bind(this)}
            />
          </form>
          <div className={sResultsClasses} onBlur={this.onBlurSearchResults.bind(this)} >
            {this.props.weather.searchResults.length > 0 ? searchResults : null}
          </div>
          <div className="radiusBox rBoxes" >
            <p>Radius: <span className="rangeTitles" >{this.state.radius} </span>km</p>
            <Slider step={10} max={600}  min={100} value={this.state.radius} onChange={radius => this.setState({radius})} />
          </div>
          <div className="rangeBox rBoxes" >
            <p>Number of cities: <span className="rangeTitles">{this.state.numberOfCities}</span></p>
            <Slider min={1} max={9} value={this.state.numberOfCities} onChange={(numberOfCities) => this.setState({numberOfCities})} />
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
