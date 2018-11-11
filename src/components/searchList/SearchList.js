import React from 'react';
import './SearchList.css';


const SearchList = props => (
	<div className='search-list'>
		<ul tabIndex="0">
				{props.values.map(value => {
					return(<li role="button" key={value.venue.id} onClick={() => props.handleListClick(value.venue.id)}>{value.venue.name}</li>);
				})}
			</ul>
	</div>
	);

export default SearchList;