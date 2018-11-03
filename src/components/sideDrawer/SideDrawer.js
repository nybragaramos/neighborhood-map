import React from 'react';
import './SideDrawer.css'

const sideDrawer = props => { 	
	props.venues.sort((function(a, b){
    if(a.venue.name < b.venue.name) { return -1; }
    if(a.venue.name > b.venue.name) { return 1; }
    return 0;
	}));

	let drawerClasses = 'side-drawer';
	if (props.show) {
		drawerClasses = 'side-drawer open';
	}
	return (
		<nav className={drawerClasses}>
			<ul>
				{props.venues.map(venue => {
					return(<li key={venue.venue.id} onClick={() => props.handleListClick(venue.venue.id)}>{venue.venue.name}</li>);
				})}
			</ul>
		</nav>
	);}

export default sideDrawer;