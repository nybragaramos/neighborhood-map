import React, { Component } from 'react';
import './InfoWindow.css';

/*class InfoWindow extends Component{
	constructor(props) {
    super(props);
  }
	
	componentDidMount() {

	}
	render() {
		console.log(this.props);
		return (
			<div className='info-window'>
				<p>{this.props.name}</p>
			</div>
		);
	}
}*/
function InfoWindow (props) {
	console.log(props);
		return (
			<div className='info-window'>{props.name}</div>
		);
}

export default InfoWindow
