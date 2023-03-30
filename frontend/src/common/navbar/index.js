import React from 'react';
import { Link } from "react-router-dom";

import '../../assets/navbar.css';

import SearchBar from '../search/SearchBar';

const Navbar = () => {
    return (
      <div className="navbar">
        <div className="navbar-container">
          <div></div>
          <SearchBar />
          <div className="links">
            <Link to="/" className="navbar-link">Portfolio</Link>
          </div>
        </div>
      </div>
    )
}

export default Navbar;