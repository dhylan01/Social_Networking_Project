import React from 'react'
import {Link} from 'react-router-dom'

export const NavBar = () => {
    return (
        <nav className ="navbar bg-dark">
        <h1>
          <Link to ="index.html">
          <i className="fas fa-code" /> DevConnector
          </Link>
        </h1>
        <ul>
          <li><a href='!#'>Developers</a></li>
          <li>
          <Link to="/register.html">Register</Link>
          </li>
          <li><Link to ="/login.html">Login</Link></li>
        </ul>
      </nav>
    )
}

export default NavBar;