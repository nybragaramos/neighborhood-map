import React, { Component } from 'react';
import './App.css';
import Map from './components/map/Map';
import Toolbar from './components/toolbar/Toolbar';
import SideDrawer from './components/sideDrawer/SideDrawer';
import Backdrop from './components/backdrop/Backdrop';
import SearchList from './components/searchList/SearchList';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faSun, faSuitcase, faCocktail, faUtensils, faInfo, faSearch, faBars, faPhone} from '@fortawesome/free-solid-svg-icons';

const FOURSQUARE_API = 'https://api.foursquare.com/v2/venues/explore?';
const CLIENT_ID = "WCSYL05LCDFT1FZUPPCKTTTAGXHIJW35BSM0ZB2ASSN1AS30"; 
const CLIENT_SECRET = "XWO5JGWXXJCJEBHAGHIQEAPCD02Y5THUQLZDLLG1NJW2RUKU";
const NEAR = 'Münster';
const RADIUS = '3000';

class App extends Component {
  constructor(props) {
    super(props);

    this.mapLoad = this.mapLoad.bind(this);
    this.configInfoWindow = this.configInfoWindow.bind(this);
    this.handleListClick = this.handleListClick.bind(this);
    this.drawerToggleClickHandler = this.drawerToggleClickHandler.bind(this);
    this.backdropDrawerHandler = this.backdropDrawerHandler.bind(this);
    this.backdropListHandler = this.backdropListHandler.bind(this);
    this.handleSearchByName = this.handleSearchByName.bind(this);
    this.searchType = this.searchType.bind(this);
    this.listDisplayHandler = this.listDisplayHandler.bind(this);

    this.state = {
      venues: [],
      restaurants: [],
      nightlife: [],
      outdoor: [],
      travel: [],
      informationCenter: [],
      markers: [],
      map: null,
      details: [],
      hours: [],
      sideDrawerOpen: false,
      showVenues: [],
      infoWindow: null,
      query: '',
      showList: false
    };
  }

  componentDidMount() {
    let url = new URL(FOURSQUARE_API);

    url.search = new URLSearchParams({client_id: CLIENT_ID, client_secret: CLIENT_SECRET, categoryId: '4bf58dd8d48988d1c4941735', near: NEAR, v: "20181025", radius: RADIUS});

    fetch(url)
    .then(this.handleRequestErrors)
    .then(data => {
      let venues = data.response.groups[0].items;
      venues = venues.map(place => {
        place.venue.name = this.capitalizeFirstLetter(place.venue.name);
        return place;
      })
      this.sortVenues(venues);
      this.setState({venues: venues, showVenues: venues, restaurants:venues});
      if(this.state.map){
        this.setState({infoWindow: new window.google.maps.InfoWindow({maxWidth: 350, maxHeight: 400})})
        this.createMarkers(this.state.map);
      }
    })
    .catch(error => {
        console.log('Request Restaurants Fail', error)
    });
  }

  handleRequestErrors(response) {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response.json();
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

  createMarkers(){

    const bounds = new window.google.maps.LatLngBounds();
    let map = this.state.map;
    let ms = this.state.venues.map(content => {
      // Create A Marker
      const marker = new window.google.maps.Marker({
        position: {lat: content.venue.location.lat , lng: content.venue.location.lng},
        map: map,
        animation: window.google.maps.Animation.DROP,
        title: content.venue.name,
        id: content.venue.id
      });

      bounds.extend(marker.position);

      marker.addListener('click', () => {
        this.configInfoWindow(marker, content.venue);
      })
      return marker;
    });
    map.fitBounds(bounds);
    this.setState({markers: ms, map:map});
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

  reloadMarkers(){
    this.deleteMarkers();
    const that = this;
    setTimeout(function() {
      that.createMarkers();
    }, 0);
  }

  /*Handle the click at the menu list*/
  handleListClick(id) {
    this.setState({showList: false, query:'', showVenues:this.state.venues, sideDrawerOpen:true});
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
    })
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
      url.search = new URLSearchParams({client_id: CLIENT_ID, client_secret: CLIENT_SECRET, v: "20181025", locale:'en'});

      fetch(url)
      .then(this.handleRequestErrors)
      .then(data => {
        this.setState(previousState => ({
          details: [...previousState.details, data.response.venue],
        }));
        this.configInfoWindow(marker, content);
      }).catch(error => {
        console.log('Request failed Details', error)
        this.setContentInfoWindow(infoWindow,null, error);
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

  setContentInfoWindow(infoWindow, details, error) {
    let content = '';
    if(!details){
      content+= `<p>${error}</p>`
    } 
    else {
      let photo = '';
      if(details.bestPhoto) {
        photo= details.bestPhoto.prefix + '208x120' + details.bestPhoto.suffix
      } else {
        photo= 'https://via.placeholder.com/208x120.png?text=No+Image'
      }

      content = `<div class='info-window'>
          <img src=${photo} alt=´${details.name} provided by foursquare´>
          <h2>${details.name}</h2>`;

      if(details.categories[0]){
        content += `<p>${details.categories[0].shortName}</p>`
      }
      content += `<p>${details.location.address}</p>`
      if(details.contact.phone){
        content += `<p>${details.contact.phone}</p>`
      }

      if(details.hours){
        const timeframes=details.hours.timeframes;
        content += `<div class='opening'>`;
        content += `<p class='opening-title'><strong >${details.hours.status}</strong></p>`;
        timeframes.forEach(openingHours);
        content += `</div>`
      }

      content += `</div>`
    }

    infoWindow.setContent(content);
    function openingHours(time) {
      content += `<p class='opening-days'>${time.days}</p>
      <p class='opening-hours'>${time.open[0].renderedTime}</p>`;
    }
  }

  

  drawerToggleClickHandler() {
    this.setState(prevState => ({
      sideDrawerOpen: !prevState.sideDrawerOpen
    }));
    this.setState({showList:false});
    this.showAllMarkers(); 
  }

  backdropDrawerHandler() {
    this.setState({sideDrawerOpen:false});
  }

  backdropListHandler() {
    this.setState({showList:false, query:'', showVenues: this.state.venues});
  }

  listDisplayHandler() {
    this.setState({showList:true, sideDrawerOpen:false});
    this.showAllMarkers();
  }

  searchByType (categoryId){
    let url = new URL(FOURSQUARE_API);
    url.search = new URLSearchParams({client_id: CLIENT_ID, client_secret: CLIENT_SECRET, near:NEAR, categoryId: categoryId, v: "20181025", radius: RADIUS});
    return fetch(url).then(this.handleRequestErrors)
      .then(data => {
        this.orderVenues(data.response.groups[0].items)
        let venues = this.orderVenues(data.response.groups[0].items);
        this.deleteMarkers();
        this.createMarkers();
        return venues;
      })
      .catch(error => {
        console.log('Request Restaurants Fail', error)
      });
  }

  orderVenues(data){
    data = data.map(place => {
      place.venue.name = this.capitalizeFirstLetter(place.venue.name);
      return place;
    })
    this.sortVenues(data);
    this.setState({venues: data, showVenues:data});
    return data;
  }

  searchType(event) {

    this.setState({query:'', showList:false});

    switch(event) {
    case 'nightlife':
      if(this.state.nightlife.length === 0){
        this.searchByType('4d4b7105d754a06376d81259').then(venues => {
          this.setState({nightlife: venues});
        });
        this.setState({type:event});
      } else {
        this.setState({venues: this.state.nightlife, showVenues:this.state.nightlife, type:event});
        this.reloadMarkers();
      }
      break;
    case 'outdoor':
      if(this.state.outdoor.length === 0){
        this.searchByType('4d4b7105d754a06377d81259').then(venues => {
          this.setState({outdoor: venues});
        });
        this.setState({type:event});
      } else {
        this.setState({venues: this.state.outdoor, showVenues:this.state.outdoor, type:event});
        this.reloadMarkers();
      }
      break;
    case 'travel':
      if(this.state.travel.length === 0){
        this.searchByType('4d4b7105d754a06379d81259').then(venues => {
          this.setState({travel: venues});
        });
        this.setState({type:event});
      } else {
        this.setState({venues: this.state.travel, showVenues:this.state.travel, type:event});
        this.reloadMarkers();
      }
      break;
    case 'informationCenter':
      if(this.state.informationCenter.length === 0){
        this.searchByType('4f4530164b9074f6e4fb00ff').then(venues => {
          this.setState({informationCenter: venues});
        });
        this.setState({type:event});
      } else {
        this.setState({venues: this.state.informationCenter, showVenues:this.state.informationCenter, type:event});
        this.reloadMarkers();
      }
      break;
    default:
      this.setState({venues: this.state.restaurants, showVenues:this.state.restaurants, type:event});
      this.reloadMarkers();
    }
  }
  
  render() {
    let backdrop;
    let searchList;

    if(this.state.sideDrawerOpen) {
      backdrop = <Backdrop click={this.backdropDrawerHandler}/>;
    }
    if(this.state.showList){
      backdrop = <Backdrop click={this.backdropListHandler}/>;
      searchList = <SearchList values={this.state.showVenues} handleListClick={this.handleListClick}/>;
    }
    return (
      <div className="App">
        <Toolbar drawerClickHandler={this.drawerToggleClickHandler} search={this.handleSearchByName} query={this.state.query} display={this.listDisplayHandler} showSearch={this.state.showList}/>
        <SideDrawer show={this.state.sideDrawerOpen}  searchType={this.searchType}/>;
        {backdrop}
        <main>
          {searchList}
          <Map id="map" options={{center: {lat: 51.961773, lng: 7.621385}, zoom: 13,         mapTypeControl: false
}} mapLoad= {this.mapLoad}/>
        </main>
      </div>
    );
  }
}

library.add(faSun, faSuitcase, faCocktail, faUtensils, faInfo, faSearch, faBars, faPhone);
export default App;
