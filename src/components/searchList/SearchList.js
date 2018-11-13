import React from 'react';
import './SearchList.css';


const searchList = props => {
	let searchListClasses = 'search-list';
  if (props.show) {
    searchListClasses = 'search-list open';
  }
	return (
		<div className={searchListClasses} tabIndex="0">
			<ul tabIndex="0">
				{props.values.map(value => {
					return(<li role="button" key={value.venue.id} onKeyPress={() => props.handleListClick(value.venue.id)} onClick={() => props.handleListClick(value.venue.id)}>{value.venue.name}</li>);
				})}
			</ul>
		</div>
	); 
}

export default searchList;