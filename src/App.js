import React, { Component } from 'react';
/*import logo from './logo.svg';*/
import './App.css';
import Map from './components/map/Map'

class App extends Component {
  render() {
    return (
      <div className="App">
        <header role="banner" className='header-principal'><h1>Münster City Map</h1></header>
        <main>
          <Map id="map" options={{center: {lat: 51.961773, lng: 7.621385}, zoom: 13}}/>
        </main>
      </div>
    );
  }
}

export default App;
