import React from 'react';
import './DrawerToggleButton.css';

const drawerToggleButton = props => (
	<button className='toggle-button' aria-label="Side Menu" onClick={props.click}>
		<div className='toggle-button-line'/>
		<div className='toggle-button-line'/>
		<div className='toggle-button-line'/>
	</button>
	);

export default drawerToggleButton;