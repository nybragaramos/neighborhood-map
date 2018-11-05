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