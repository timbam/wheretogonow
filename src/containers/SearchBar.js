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

    this.state = { term: '', radius: 300, numberOfCities: 5, isHidden: false, isBlurred: false, btnFocused: false, btnID: -1, hideInfoBox: true};
    this.onInputChange = this.onInputChange.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.onSetIndexToSortBy = this.onSetIndexToSortBy.bind(this);
    this.onToggleInfoBox = this.onToggleInfoBox.bind(this);
  }

  onInputChange(e) {
    this.setState({ term: e.target.value });
    this.props.searchCity(e.target.value, 10);
  }

  onFormSubmit(e) {
    e.preventDefault();
  }

  onfetchWeather(cityObject) {
    this.setState({
      term: '',
      btnID: -1
    });
    // console.log(cityObject);
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

  onToggleInfoBox() {
    if(this.state.hideInfoBox){
      this.setState({
        hideInfoBox: false
      });
    }else{
      this.setState({
        hideInfoBox: true
      });
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
    let btn = this.refs['button' + newId];
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
    let sResultsClasses = classNames({
        'searchResults': true,
         'col-lg-12': true,
         'isHid': !(this.state.term.length > 0) || (this.state.isBlurred && !this.state.btnFocused)
    });
    let hiddenClass = classNames({
      'isHid': (this.state.isHidden)
    })
    let infoBox = classNames({
      'infoBox': true,
      'isHid': (this.state.hideInfoBox)
    })
    const searchResults = this.props.weather.searchResults.map((item, index) => {
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
            <button onClick={this.onToggleInfoBox} className="btn btn-info" >Info</button>
            <div className={infoBox}>
              <p>
                - <span className="bold">Limit</span> your search results with a radius and number of cities. <br/>
                - <span className="bold">Search</span> for a city to get the weather of the cities nearby. <br/>
                - <span className="bold">Add cities</span> by double clicking on the map. <br/>
                - <span className="bold">Remove cities</span> by single-clicking on them. <br/>
                - <span className="bold">Sort</span> cities by temperature by clicking on the date in the table. <br/>
                <span className="italic">Weather data from <a target="_blank" href="https://www.yr.no">yr.no</a></span>.
            </p>
            </div>
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
