import React, { Component } from 'react';
/*import { render } from 'react-dom';
*/
import './App.css';
import Map from './components/map/Map';
/*import infowindow from './components/infoWindow/InfoWindow';
*/
import Toolbar from './components/toolbar/Toolbar';
import SideDrawer from './components/sideDrawer/SideDrawer';
import Backdrop from './components/backdrop/Backdrop';


const FOURSQUARE_API = 'https://api.foursquare.com/v2/venues/explore?';
const CLIENT_ID = "WCSYL05LCDFT1FZUPPCKTTTAGXHIJW35BSM0ZB2ASSN1AS30"; 
const CLIENT_SECRET = "XWO5JGWXXJCJEBHAGHIQEAPCD02Y5THUQLZDLLG1NJW2RUKU";
const NEAR = 'Münster';

const DETAILS_SAMPLE = {
  bestPhoto:  {
    id: "57d145f0cd1044e801c38507",
    prefix: "https://igx.4sqi.net/img/general/",
    suffix: "/59727133_2qpuAi6jBe813j_HwI7snB94qiws2wgXSNV0CPoisyo.jpg",
    visibility: "public"
  },
  categories: [ {
    icon: {
      prefix: "https://ss3.4sqi.net/img/categories_v2/food/fastfood_",
      suffix: ".png",
    },
    id: "4bf58dd8d48988d16e941735",
    name: "Restaurante Fast Food",
    pluralName: "Restaurante Fast Food",
    shortName: "Fast Food"
  }],
  id: "4c15492a8aedd13ae2cd5137",
  contact: {
    facebook: "182011465154997",
    phone: "+492514828393"
  },
  location: {
    addres: "Bohlweg 70-72",
    cc: "DE",
    city: "Münster",
    country: 'Alemanha',
    formattedAddress: ["Bohlweg 70-72", "48147 Münster", "Alemanha"],
    lat:'',
    lng:'',
    postalCode: "48147",
    state: "Nordrhein-Westfalen"
  },
  name: "Burger King",
  shortUrl: "http://4sq.com/9c8CPW",
  url: "http://www.burgerking.de",
  price: {
    currency:"€",
    message: "Barato",
    tier: 1
  }
}

class App extends Component {
  constructor(props) {
    super(props);

    this.mapLoad = this.mapLoad.bind(this);
    this.populateInfoWindow = this.populateInfoWindow.bind(this);
    this.handleListClick = this.handleListClick.bind(this);
    this.drawerToggleClickHandler = this.drawerToggleClickHandler.bind(this);
    this.backdropClickHandler = this.backdropClickHandler.bind(this);

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
      map: null,
      details: [DETAILS_SAMPLE],
      sideDrawerOpen : false
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

  handleListClick(id) {
    this.searchedMarkerLoad(this.state.map, id);
    this.setState(prevState => ({
      sideDrawerOpen: !prevState.sideDrawerOpen
    }));
  }

  mapLoad(map) {
    this.setState({map: map});
  }

  markersLoad(map){
    const infoWindow = new window.google.maps.InfoWindow();
    let ms = this.state.venues.map(content => {
      // Create A Marker
      const marker = new window.google.maps.Marker({
        position: {lat: content.venue.location.lat , lng: content.venue.location.lng},
        map: map,
        animation: window.google.maps.Animation.DROP,
        title: content.venue.name,
        id: content.venue.id
      });

      marker.addListener('click', () => {
        this.populateInfoWindow(infoWindow, marker, content.venue);
      })
      return marker;
    });
    this.setState({markers: ms});
  }

  searchedMarkerLoad(map, id) {
    this.clearMarkers();
    let markers = this.state.markers.slice();
    let markerindex = markers.findIndex(function (element,index) {
      return (element.id === id) ? index : null;
    });

    if(markers[0].id === id){
      markerindex = 0;
    }
    
    if(markerindex > -1){
      markers[markerindex].setMap(map);
      this.setState({markers: markers});
      const content = this.state.venues.find(function (element) {
        return (element.venue.id === id) ? element : null;
      });

      const infoWindow = new window.google.maps.InfoWindow();
      this.populateInfoWindow(infoWindow, markers[markerindex], content.venue);
    }
  }

  // Removes the markers from the map, but keeps them in the array.
  clearMarkers() {
    let clearMarkers = this.state.markers.slice();
    clearMarkers =  clearMarkers.map(marker => {
      marker.setMap(null);
      return marker;
    });

    this.setState({markers: clearMarkers});

  }

  // Deletes all markers in the array by removing references to them.
  deleteMarkers() {
    this.clearMarkers();
    this.setState({markers: []});
  }

  showAllMarkers() {
    let markers = this.state.markers.slice() //copy the array
    markers = markers.map(marker => {
      marker.setMap(this.state.map);
      return marker;
    }) //execute the manipulations
    this.setState({markers: markers});
  }


  populateInfoWindow(infoWindow, marker, content) {

    if (infoWindow.marker !== marker) {
      infoWindow.close();
      infoWindow.setContent('');
      infoWindow.marker = marker;

      // Make sure the marker property is cleared if the infowindow is closed.
      infoWindow.addListener('closeclick',function(){
        infoWindow.setMarker = null;
      });

      let details = this.state.details.find(function (element) {
            return (element.id === content.id) ? element : null;
      });
      
      if(details){

        let photo = '';
        if(details.bestPhoto) {
          photo= details.bestPhoto.prefix + '100x100' + details.bestPhoto.suffix
        }

        infoWindow.setContent(`
          <div>
            <p>${details.id}</p>
            <p>${details.name}</p>
            <img src=${photo}>
          </div>`);
        infoWindow.open(marker.map, marker);
      } else {
        let url = new URL(`https://api.foursquare.com/v2/venues/${content.id}`);
        url.search = new URLSearchParams({client_id: CLIENT_ID, client_secret: CLIENT_SECRET, v: "20181025"});

        fetch(url).then(response => response.json())
        .then(data => data.response.venue)
        .then(data => {
          this.setState(previousState => ({
            details: [...previousState.details, data]
          }));
          let photo = '';
          if(data.bestPhoto) {
            photo= data.bestPhoto.prefix + '100x100' + data.bestPhoto.suffix;
          }

          infoWindow.setContent(`
            <div>
              <p>${data.id}</p>
              <p>${data.name}</p>
             <img src=${photo}>
            </div>`);
          
          infoWindow.open(marker.map, marker);
        });
      }
      // Anima o marker ao clicar
      marker.setAnimation(window.google.maps.Animation.BOUNCE);
      setTimeout(function() {
          marker.setAnimation(null);
      }, 1000);
   }
    
  }

  drawerToggleClickHandler() {
    this.setState(prevState => ({
      sideDrawerOpen: !prevState.sideDrawerOpen
    }));
  }

  backdropClickHandler() {
    this.setState({sideDrawerOpen:false});
  }
  
  render() {
    let backdrop;

    if(this.state.sideDrawerOpen) {
      backdrop = <Backdrop click={this.backdropClickHandler}/>;
    }
    return (
      <div className="App">
        <Toolbar drawerClickHandler={this.drawerToggleClickHandler}/>
        <SideDrawer venues={this.state.venues} handleListClick={this.handleListClick} show={this.state.sideDrawerOpen}/>;
        {backdrop}
        <main>
          <Map id="map" options={{center: {lat: 51.961773, lng: 7.621385}, zoom: 13,         mapTypeControl: false
}} mapLoad= {this.mapLoad}/>
        </main>
      </div>
    );
  }
}

export default App;
