import React, { Component } from 'react';
import './Map.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


class Map extends Component {

  constructor(props) {
    super(props);
    this.state = {
      scriptError: false   
    };
  }

  onScriptLoad() {
    const map = new window.google.maps.Map(
      document.getElementById(this.props.id),
      this.props.options);
    this.props.mapLoad(map);
  }

  componentDidMount() {

    if (!window.google) {

    	//create google maps script
      let script = document.createElement('script');
      script.src = `https://maps.google.com/maps/api/js?key=AIzaSyALa3cDehIN5lKkIcA0yeOwx_cUil_AWK4`;
      script.async = true;
		  script.defer = true;

		  //We cannot access google.maps until it's finished loading
      script.addEventListener('load', e => {
        this.onScriptLoad();
        this.setState({scriptError: false})
      })
      script.addEventListener('error', e => {
        this.setState({scriptError: true})
        this.props.mapLoad(null);
      })


      let firstIndexScript = document.getElementsByTagName('script')[0];
      firstIndexScript.parentNode.insertBefore(script, firstIndexScript);

    } else {
      this.setState({scriptError: false})
      this.onScriptLoad();
    }
  }

  render() {
    return (this.state.scriptError ? 
      <div className='map-error' aria-label='Error loading map'><FontAwesomeIcon className='map-error-icon' icon="exclamation-triangle" /><p>Google Maps couldn't be Load</p><p>Please try to reload the page</p></div> :
      <div className='map' id={this.props.id} role="application" aria-label='Münster City Map' />);
  }
}

export default Map
