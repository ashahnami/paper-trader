import React from 'react';
import { Link } from "react-router-dom";

import '../../assets/navbar.css';

import SearchBar from '../search/SearchBar';

const Navbar = () => {
    return (
      <div className="navbar">
        <Link to="/" className="navbar-link">Portfolio</Link>
        <SearchBar />
      </div>
    )
}

export default Navbar;