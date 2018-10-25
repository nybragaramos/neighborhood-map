import React, { Component } from 'react';
/*import logo from './logo.svg';*/
import './App.css';
import Map from './components/map/Map'

const FOURSQUARE_API = 'https://api.foursquare.com/v2/venues/explore?';
const CLIENT_ID = "WCSYL05LCDFT1FZUPPCKTTTAGXHIJW35BSM0ZB2ASSN1AS30"; 
const CLIENT_SECRET = "XWO5JGWXXJCJEBHAGHIQEAPCD02Y5THUQLZDLLG1NJW2RUKU";
const NEAR = 'Münster';

class App extends Component {
  constructor(props) {
    super(props);

    this.mapLoad = this.mapLoad.bind(this);

    this.state = {
      venues: [], 
      markers: [],
      searchParam: {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        query: "food",
        near: NEAR,
        v: "20181025"
      },
      map: null
    };
  }

  componentDidMount() {
    let url = new URL(FOURSQUARE_API);
    url.search = new URLSearchParams(this.state.searchParam);

    fetch(url).then(response => response.json())
    .then(data => {
      this.setState({venues: data.response.groups[0].items});
      if(this.state.map){
        this.markersLoad(this.state.map);
      }
    });
  }

  mapLoad(map) {
    this.setState({map: map});
  }

  markersLoad(map){
    let ms = this.state.venues.map(content => {
      // Create A Marker
      const marker = new window.google.maps.Marker({
        position: {lat: content.venue.location.lat , lng: content.venue.location.lng},
        map: map,
        animation: window.google.maps.Animation.DROP,
        title: content.venue.name
      })
      return marker;
    });

    this.setState({markers: ms});
  }
  
  render() {
    return (
      <div className="App">
        <header role="banner" className='header-principal'><h1>Münster City Map</h1></header>
        <main>
          <Map id="map" options={{center: {lat: 51.961773, lng: 7.621385}, zoom: 13}} mapLoad= {this.mapLoad}/>
        </main>
      </div>
    );
  }
}

export default App;
