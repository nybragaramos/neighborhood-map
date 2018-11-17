import React from 'react';
import './Toast.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const toast = props => {

	let toastClass = 'toast';
  if (props.show) {
    toastClass = 'toast visible';
  }

	return (
		<div className={toastClass} role='alert'><FontAwesomeIcon icon="exclamation-triangle" /><p>{props.message}</p></div>
	);
}	

export default toast;