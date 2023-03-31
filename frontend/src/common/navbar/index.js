import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import httpClient from '../../httpClient'
import SearchBar from '../search/SearchBar';
import '../../assets/navbar.css';

const Navbar = () => {

  const [dropdown, setDropdown] = useState(false)

  const navigate = useNavigate()
  const logout = () => {
    httpClient.post("http://localhost:5000/logout")
    .then(function(response){
      console.log(response)
    })
    navigate("/login")
  }

  return (
    <div className="navbar">
      <div className="navbar-container">
        <div></div>
        <SearchBar />
        <div className="links">
          <Link to="/" className="navbar-link">Portfolio</Link>
          <div className="account">
            <AccountCircleIcon className="icon" onClick={() => setDropdown(!dropdown)} />
            {dropdown ? 
              <div className="dropdown">
                <div onClick={logout}>Log Out</div>
              </div> 
            : null}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Navbar;