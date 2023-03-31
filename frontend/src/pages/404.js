import React from 'react'
import { Link } from 'react-router-dom'
import "../assets/404.css"

const NotFound = () => {
  return (
    <div className="notfound">
        <div className="notfound-container">
            <h1>404</h1>
            <h4>Page not found</h4>
            <div>
                <p>The page you are trying to access doesn't exist.</p>
                <p>Go back or head back to the home <Link to="/" className="link">here</Link></p>
            </div>
        </div>
    </div>
  )
}

export default NotFound
