import React from 'react';
import './Toolbar.css';
import {DebounceInput} from 'react-debounce-input';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


const Toolbar = props => {
  let search = <button aria-label="open search input" className='toolbar-search-open' onClick={props.display}><FontAwesomeIcon icon="search" /></button>;;
  let logoClasses = 'toolbar-logo';

  if(props.showSearch){
    search = <DebounceInput
        className='search-input'
        placeholder='Search'
        autoFocus
        minLength={2}
        debounceTimeout={300}
        aria-label='Search by name'
        onChange={event => props.search(event.target.value)} 
        value={props.query}/>;
    logoClasses = 'toolbar-logo close';
  } 

  return (
    <header className='toolbar'>
      <nav className='toolbar-navigation'>
        <button aria-label="Side Menu" className='toolbar-menu' onClick={props.drawerClickHandler}><FontAwesomeIcon icon="bars" /></button>
        <div className={logoClasses}><a href="/">Münster City Map</a></div>
        <div className='spacer'/>
        {search} 
      </nav>
    </header>
  );
}



export default Toolbar;