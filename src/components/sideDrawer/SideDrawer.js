import React from 'react';
import './SideDrawer.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const sideDrawer = props => { 	

	let drawerClasses = 'side-drawer';
	if (props.show) {
		drawerClasses = 'side-drawer open';
	}
	return (
		<nav className={drawerClasses}>
			<button className='options-button' onClick={() => props.searchType("restaurants")} id="restaurants"><FontAwesomeIcon className="icons" icon="utensils" />Restaurants</button>
			<button className='options-button' onClick={() => props.searchType("nightlife")} id="nightlife"><FontAwesomeIcon className="icons" icon="cocktail" />Nightlife</button>
			<button className='options-button' onClick={() => props.searchType("outdoor")} id="outdoor"><FontAwesomeIcon className="icons" icon="sun" />Outdoor</button>
			<button className='options-button' onClick={() => props.searchType("travel")} id="travel"><FontAwesomeIcon className="icons" icon="suitcase" />Travel</button>
			<button className='options-button' onClick={() => props.searchType("informationCenter")} id="informationCenter"><FontAwesomeIcon className="icons info" icon="info" />Information Center</button>
		</nav>
	);}

export default sideDrawer;