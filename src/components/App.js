import React from 'react';
import SearchBar from '../containers/SearchBar';

export default class App extends React.Component {
  render(){
    return(
        <div>
          <SearchBar />
          {this.props.children}
        </div>
    );
  }
}
