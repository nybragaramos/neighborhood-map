import React from 'react';
import './Toolbar.css';
import {DebounceInput} from 'react-debounce-input';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


const Toolbar = props => (
		<header className='toolbar'>
			<nav className='toolbar-navigation'>
				<button aria-label="Side Menu" className='toolbar-menu' onClick={props.drawerClickHandler}><FontAwesomeIcon icon="bars" /></button>
				<div className='toolbar-logo'><a href="/">Münster City Map</a></div>
				<div className='spacer'/>
				<DebounceInput
				onFocus={props.display}
				className='search-input'
				placeholder='Search'
        minLength={2}
        debounceTimeout={300}
        aria-label='Search by name'
        onChange={event => props.search(event.target.value)} 
        value={props.query}/>
			</nav>
		</header>
	);

export default Toolbar;