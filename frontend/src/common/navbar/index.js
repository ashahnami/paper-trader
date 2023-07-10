import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ShowChartIcon from '@mui/icons-material/ShowChart';

import httpClient from '../../httpClient'
import SearchBar from '../search/SearchBar';
import '../../assets/navbar.css';

const Navbar = () => {

  const [dropdown, setDropdown] = useState(false);

  let accountMenuRef = useRef();

  const navigate = useNavigate()
  const logout = () => {
    httpClient.post("http://localhost:5000/logout")
    .then(function(response){
      console.log(response)
    })
    navigate("/login")
  }

  useEffect(() => {
    let handler = (event) => {
      if(!accountMenuRef.current.contains(event.target)){
        setDropdown(false);
      }
    }

    document.addEventListener("mousedown", handler);

    return() => {
      document.removeEventListener("mousedown", handler);
    }
  })

  return (
    <div className="navbar">
      <div className="navbar-container">
        <Link to="/" className="home-link"><ShowChartIcon></ShowChartIcon></Link>
        <SearchBar />
        <div className="links">
          <Link to="/portfolio" className="navbar-link">Portfolio</Link>
          <div className="account" ref={accountMenuRef}>
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