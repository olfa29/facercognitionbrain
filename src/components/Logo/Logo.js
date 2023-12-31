import React from 'react';
import { Tilt } from 'react-tilt';
import brain from './brain.png'
import './Logo.css'

const defaultOptions = {
	max: 55,     // max tilt rotation (degrees)
}

const Logo = ()=>{
	return(
		<div className='ma4 mt0'>
			<Tilt className='Tilt br2 shadow-2' options={defaultOptions} style={{ height: 150, width: 150 }}>
		      <div className=' pa3'>
		      	<img style={{paddinTop:'5px'}} alt='logo' src={brain}/>
		      </div>
		    </Tilt>
			
		</div>
		);
}

export default Logo