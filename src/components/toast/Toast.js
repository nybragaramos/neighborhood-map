import React from 'react';
import './Toast.css';

const toast = props => {

	let toastClass = 'toast';
  if (props.show) {
    toastClass = 'toast visible';
  }

	return (
		<div className={toastClass} role='alert'><p>{props.message}</p></div>
	);
}	

export default toast;