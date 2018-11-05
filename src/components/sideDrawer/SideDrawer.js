import React from 'react';
import './SideDrawer.css'
import {DebounceInput} from 'react-debounce-input';

const sideDrawer = props => { 	

	let drawerClasses = 'side-drawer';
	if (props.show) {
		drawerClasses = 'side-drawer open';
	}
	return (
		<nav className={drawerClasses}>
      <div className='radio-group' onChange={event => props.searchType(event.target.value)}>
      	<div className='radio-option'>
      		<input type="radio" value="restaurants" id="restaurants" defaultChecked name="option"/>
        	<label htmlFor="restaurants">Restaurants</label>
      	</div>
        <div className='radio-option'>
        <input type="radio" value="nightlife" id="nightlife" name="option"/>
        <label htmlFor="nightlife">Nightlife</label>
        </div>
        <div className='radio-option'>
        <input type="radio" value="outdoor" id="outdoor" name="option"/>
        <label htmlFor="outdoor">Outdoor</label>
        </div>
        <div className='radio-option'>
        <input type="radio" value="travel" id="travel" name="option"/>
        <label htmlFor="travel">Travel</label>
        </div>
        <div className='radio-option'>
        <input type="radio" value="informationCenter" id="informationCenter" name="option"/>
        <label htmlFor="informationCenter">Information Center</label>
        </div>
      </div>
      <DebounceInput
				className='search-input'
				placeholder='Search by name'
        minLength={2}
        debounceTimeout={300}
        onChange={event => props.search(event.target.value)} 
        value={props.query}/>
			<ul>
				{props.values.map(value => {
					return(<li key={value.venue.id} onClick={() => props.handleListClick(value.venue.id)}>{value.venue.name}</li>);
				})}
			</ul>
		</nav>
	);}

export default sideDrawer;