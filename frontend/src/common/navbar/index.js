import React from 'react';
import { Link } from "react-router-dom";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

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
            <Link to="/account" className="navbar-link">
              <AccountCircleIcon />
            </Link>
          </div>
        </div>
      </div>
    )
}

export default Navbar;