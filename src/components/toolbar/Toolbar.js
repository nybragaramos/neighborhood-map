import React from 'react';
import DrawerToggleButton from '../sideDrawer/DrawerToggleButton';
import './Toolbar.css';


const Toolbar = props => (
	<header className='toolbar'>
		<nav className='toolbar-navigation'>
			<div>
				<DrawerToggleButton click={props.drawerClickHandler}/>
			</div>
			<div className='toolbar-logo'><a href="/">Münster City Map</a></div>
			<div className='spacer'/>
			<div className='toolbar-navigation-itens'>
				<ul>
					<li><a href="/">About</a></li>
				</ul>
			</div>
		</nav>
	</header>
	);

export default Toolbar;