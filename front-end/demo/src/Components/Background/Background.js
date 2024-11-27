import React from 'react'
import "./Background.css"

const Background = ({ children, image }) => {
  return (
    <div className="background-container" style={{ backgroundImage: `url(${image})`}}>
      {children}
    </div>
  )
}

export default Background
