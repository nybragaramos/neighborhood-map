import React from 'react';
import './SideDrawer.css'
import {DebounceInput} from 'react-debounce-input';
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
      <DebounceInput
				className='search-input'
				placeholder='Search by name'
        minLength={2}
        debounceTimeout={300}
        aria-label='Search by name'
        onChange={event => props.search(event.target.value)} 
        value={props.query}/>
			<ul tabIndex="0">
				{props.values.map(value => {
					return(<li role="button" key={value.venue.id} onClick={() => props.handleListClick(value.venue.id)}>{value.venue.name}</li>);
				})}
			</ul>
		</nav>
	);}

export default sideDrawer;