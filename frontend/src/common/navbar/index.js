import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ShowChartIcon from '@mui/icons-material/ShowChart';

import httpClient from '../../httpClient'
import SearchBar from '../search/SearchBar';
import '../../assets/navbar.css';
import { useGetCurrentUserQuery } from '../../api/userApi'

const Navbar = () => {
  const { data: user, isLoading } = useGetCurrentUserQuery()

  const [dropdown, setDropdown] = useState(false)

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
        <div className='links'>
          <Link to="/" className='home-link'><ShowChartIcon></ShowChartIcon></Link>
        </div>

        <SearchBar />

        <div className="account" ref={accountMenuRef}>
          <AccountCircleIcon className="icon" onClick={() => setDropdown(!dropdown)} />
          {dropdown ? 
            <div className="dropdown">

              {!isLoading ? 
                <div className='details'>
                  <div className='username'>{user.username}</div>
                  <div className='email'>{user.email}</div>
                </div>
              : null}

              <div className='links'>
                <hr className='divider'></hr>

                <div onClick={() => navigate('/portfolio')}>Portfolio</div>

                <div onClick={() => navigate('/settings')}>Settings</div>

                <hr className='divider' />

                <div onClick={logout}>Log Out</div>
              </div>
            </div> 
          : null}
        </div>
      </div>
    </div>
  )
}

export default Navbar;