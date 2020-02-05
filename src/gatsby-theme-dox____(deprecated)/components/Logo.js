import React from 'react'
import SchoolIcon from '@material-ui/icons/School';

function Logo(props) {
  return (
    <div className='logo' {...props}>
      <SchoolIcon fontSize="large" /> 
      <span className="logo-text">OI Wiki</span>
    </div>
  )
}

export default Logo
