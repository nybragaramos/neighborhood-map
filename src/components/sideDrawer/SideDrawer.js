import React from 'react';
import './SideDrawer.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const sideDrawer = props => {   

  let drawerClasses = 'side-drawer';
  if (props.show) {
    drawerClasses = 'side-drawer open';
  }
  const categories = [{name: 'restaurants', id:'4bf58dd8d48988d1c4941735', label:'Restaurants', icon:'utensils'},
                      {name: 'nightlife', id:'4d4b7105d754a06376d81259', label:'Nightlife', icon:'cocktail'},
                      {name: 'outdoor', id:'4d4b7105d754a06377d81259', label:'Outdoor', icon:'sun'},
                      {name: 'travel', id:'4d4b7105d754a06379d81259', label:'Travel', icon: 'suitcase'},
                      {name: 'informationCenter',id:'4f4530164b9074f6e4fb00ff', label:'Information Center', icon:'info-circle'}];
  return (
    <nav className={drawerClasses}>
      {categories.map(category => {
        if(category.id === props.category)
          return <button className='options-button clicked' onClick={() => props.searchCategory(category.id, category.name)} key={category.id}><FontAwesomeIcon className="side-drawer-icons" icon={category.icon}/>{category.label}</button>
        return <button className='options-button' onClick={() => props.searchCategory(category.id, category.name)} key={category.id}><FontAwesomeIcon className="side-drawer-icons" icon={category.icon}/>{category.label}</button>
      })}
    </nav>
  );}

export default sideDrawer;