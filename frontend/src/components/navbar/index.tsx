import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ShowChartIcon from '@mui/icons-material/ShowChart';

import httpClient from '../../api/httpClient'
import SearchBar from '../search';
import '../../assets/navbar.css';
import { fetchProfile } from '../../api/userApi'
import { useQuery } from '@tanstack/react-query';
import useAuth from '../../hooks/useAuth';

const Navbar = () => {
  const { data: user, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: () => fetchProfile(),
  })

  const navigate = useNavigate()
  const [dropdown, setDropdown] = useState<boolean>(false)
  const { setAuth } : any = useAuth();

  let accountMenuRef = useRef<HTMLInputElement>(null);

  const logout = () => {
    httpClient.post("/auth/logout")
    .then(function(response){
      setAuth({});
    })
    navigate("/login");
  }

  useEffect(() => {
    let handler = (event: any) => {
      if(!accountMenuRef.current?.contains(event.target)){
        setDropdown(false);
      }
    }

    document.addEventListener("mousedown", handler);

    return() => {
      document.removeEventListener("mousedown", handler);
    }
  })

  return (
    <nav>
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
                <div className='username'>{user?.username}</div>
                <div className='email'>{user?.email}</div>
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
    </nav>
  );
};

export default Navbar;