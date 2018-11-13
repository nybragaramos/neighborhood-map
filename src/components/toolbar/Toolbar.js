import React from 'react';
import './Toolbar.css';
import {DebounceInput} from 'react-debounce-input';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Toolbar = props => {

  let logoClasses = 'toolbar-logo';
  let searchInputClass = 'toolbar-search-input';
  let searchIconClass = 'toolbar-search-icon';
  if (props.showSearch) {
    searchInputClass = 'toolbar-search-input open';
    logoClasses = 'toolbar-logo close';
    searchIconClass = 'toolbar-search-icon close';
  }


  return (
    <header className='toolbar'>
      <nav className='toolbar-navigation'>
        <button aria-label="Side Menu" className='toolbar-menu' onClick={props.drawerClickHandler}><FontAwesomeIcon icon="bars" /></button>
        <div className={logoClasses}><h1>Münster City Map</h1></div>
        <div className='spacer'/>
        <button aria-label="open search input" className={searchIconClass} onClick={props.display}><FontAwesomeIcon icon="search" /></button>
        <DebounceInput
        className={searchInputClass}
        placeholder='Search'
        autoFocus
        minLength={2}
        debounceTimeout={300}
        aria-label='Search by name'
        onChange={event => props.search(event.target.value)} 
        value={props.query}/>
      </nav>
    </header>
  );
}



export default Toolbar;