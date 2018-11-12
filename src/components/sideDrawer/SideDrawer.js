import React from 'react';
import './SideDrawer.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const sideDrawer = props => {   

  let drawerClasses = 'side-drawer';
  if (props.show) {
    drawerClasses = 'side-drawer open';
  }
  const categories = [{id:'restaurants', label:'Restaurants', icon:'utensils'},
                      {id:'nightlife', label:'Nightlife', icon:'cocktail'},
                      {id:'outdoor', label:'Outdoor', icon:'sun'},
                      {id:'travel', label:'Travel', icon: 'suitcase'},
                      {id:'informationCenter', label:'Information Center', icon:'info-circle'}];
  return (
    <nav className={drawerClasses}>
      {categories.map(category => {
        if(category.id === props.category)
          return <button className='options-button clicked' onClick={() => props.searchCategory(category.id)} key={category.id}><FontAwesomeIcon className="side-drawer-icons" icon={category.icon}/>{category.label}</button>
        return <button className='options-button' onClick={() => props.searchCategory(category.id)} key={category.id}><FontAwesomeIcon className="side-drawer-icons" icon={category.icon}/>{category.label}</button>
      })}
    </nav>
  );}

export default sideDrawer;