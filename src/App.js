import React, { Component } from 'react';
import './App.css';
import Map from './components/map/Map';
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
    this.configInfoWindow = this.configInfoWindow.bind(this);
    this.handleListClick = this.handleListClick.bind(this);
    this.drawerToggleClickHandler = this.drawerToggleClickHandler.bind(this);
    this.backdropClickHandler = this.backdropClickHandler.bind(this);
    this.handleSearchByName = this.handleSearchByName.bind(this);

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
      sideDrawerOpen : false,
      showVenues: [],
      infoWindow: null,
      query: ''
    };
  }

  componentDidMount() {
    let url = new URL(FOURSQUARE_API);
    url.search = new URLSearchParams(this.state.searchParam);

    fetch(url).then(response => response.json())
    .then(data => {
      let venues = data.response.groups[0].items;
      venues = venues.map(place => {
        place.venue.name = this.capitalizeFirstLetter(place.venue.name);
        return place;
      })
      this.sortVenues(venues);
      this.setState({venues: venues});
      this.setState({showVenues: venues});
      if(this.state.map){
        this.setState({infoWindow: new window.google.maps.InfoWindow()})
        this.createMarkers(this.state.map);
      }
    });
  }

  mapLoad(map) {
    this.setState({map: map});
  }

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  /*Sort venues by name*/
  sortVenues(venues){
    venues.sort((function(a, b){
    if(a.venue.name < b.venue.name) { return -1; }
    if(a.venue.name > b.venue.name) { return 1; }
    return 0;
    }));
  }

  createMarkers(map){
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
        this.configInfoWindow(marker, content.venue);
      })
      return marker;
    });
    this.setState({markers: ms});
  }

  /*Handle the click at the menu list*/
  handleListClick(id) {
    this.clearMarkers();
    let markers = this.state.markers.slice();
    let markerIndex;

    /*search marker with the designated id*/
    for(markerIndex=0; markerIndex<markers.length; markerIndex++){
      if(markers[markerIndex].id === id){
        break;
      }
    }
    
    if(markerIndex < markers.length){
      markers[markerIndex].setMap(this.state.map);
      this.setState({markers: markers});
      const content = this.state.venues.find(function (element) {
        return (element.venue.id === id);
      });
      this.configInfoWindow(markers[markerIndex], content.venue);
    }
    this.setState(prevState => ({
      sideDrawerOpen: !prevState.sideDrawerOpen
    }));
  }

  handleSearchByName (event){
    if(event === ''){
      this.setState({showVenues: this.state.venues, query:''});
    } else {
      let showVenues = this.state.showVenues.slice();
      showVenues = showVenues.filter(value => {
        const name = value.venue.name.toUpperCase();
        const searchName = event.toUpperCase();
        return name.includes(searchName);
      });
      this.setState({showVenues: showVenues, query:event});
    }
    this.showSelectedMarkers();
  }

  // Removes the markers from the map, but keeps them in the markers array.
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

  showSelectedMarkers() {
    let infoWindow = this.state.infoWindow;
    infoWindow.close();
    this.setState({infoWindow: infoWindow});
    let markers = this.state.markers.slice() //copy the array
    let searched = this.state.showVenues.slice();

    markers = markers.map(marker => {
      const value = searched.find(function (element) {
      return (element.venue.id === marker.id) ? element : null;
      });
      if(value) {
        marker.setMap(this.state.map);
      } else {
        marker.setMap(null);
      }
      return marker;
    }) //execute the manipulations
    this.setState({markers: markers});
  }

  showAllMarkers() {
    let infoWindow = this.state.infoWindow;
    infoWindow.close();
    this.setState({infoWindow: infoWindow});

    let markers = this.state.markers.slice() 
    markers = markers.map(marker => {
      marker.setMap(this.state.map);
      return marker;
    }) //execute the manipulations
    this.setState({markers: markers, showVenues: this.state.venues, query:''});
  }

  configInfoWindow(marker, content) {
    
    let infoWindow = this.state.infoWindow;

    infoWindow.close();
    infoWindow.setContent('');
    infoWindow.marker = marker;

    // Make sure the marker property is cleared if the infowindow is closed.
    infoWindow.addListener('closeclick',function(){
      infoWindow.setMarker = null;
    });

    const details = this.state.details.find(function (element) {
        return (element.id === content.id);
    });
      
    if(!details){
      let url = new URL(`https://api.foursquare.com/v2/venues/${content.id}`);
      url.search = new URLSearchParams({client_id: CLIENT_ID, client_secret: CLIENT_SECRET, v: "20181025"});

      fetch(url).then(response => response.json())
      .then(data => data.response.venue)
      .then(data => {
        this.setState(previousState => ({
          details: [...previousState.details, data]
        }));
        this.setContentInfoWindow(infoWindow,data);
      });
    } else {
      this.setContentInfoWindow(infoWindow,details);
    }
      
    //Animate the marker
    marker.setAnimation(window.google.maps.Animation.BOUNCE);
    setTimeout(function() {
      marker.setAnimation(null);
      infoWindow.open(marker.map, marker);
    }, 1200);
    this.setState({infoWindow: infoWindow});

  }

  setContentInfoWindow(infoWindow, details) {
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
  }

  drawerToggleClickHandler() {
    this.setState(prevState => ({
      sideDrawerOpen: !prevState.sideDrawerOpen
    }));
    this.showAllMarkers();
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
        <SideDrawer values={this.state.showVenues} handleListClick={this.handleListClick} show={this.state.sideDrawerOpen} search={this.handleSearchByName} query={this.state.query}/>;
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
