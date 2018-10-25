import React, { Component } from 'react';
import { render } from 'react-dom';
import './Map.css';

class Map extends Component {
	constructor(props) {
    super(props);
    this.onScriptLoad = this.onScriptLoad.bind(this)
  }

  onScriptLoad() {
    const map = new window.google.maps.Map(
      document.getElementById(this.props.id),
      this.props.options);
  }

  componentDidMount() {

    if (!window.google) {

    	//create google maps script
      let script = document.createElement('script');
      script.src = `https://maps.google.com/maps/api/js?key=YOUR_KEY`;
      script.async = true;
		  script.defer = true;

		  //We cannot access google.maps until it's finished loading
      script.addEventListener('load', e => {
      	console.log(e);
        this.onScriptLoad();
      })

      let firstIndexScript = document.getElementsByTagName('script')[0];
      firstIndexScript.parentNode.insertBefore(script, firstIndexScript);

    } else {
      this.onScriptLoad();
    }
  }

  render() {
    return (
        <div className='map' id={this.props.id} />
    );
  }
}

export default Map
