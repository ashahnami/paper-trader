import React from 'react';
import httpClient from "../../httpClient";

import {
  Nav,
  NavLink,
  NavBtn,
  NavBtnLink
} from './NavbarComponents';

import SearchBar from '../search/SearchBar';
import Tickers from '../search/Tickers.json';

import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logout } from '../../features/auth/authSlice'

const Navbar = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch()
  const user_id = useSelector((state) => state.auth.userId)

  const logoutUser = async () => {

    await httpClient.post("http://localhost:5000/logout")
      .then(function(response){
        console.log(response);
        dispatch(logout());
        navigate("/login");
      })
      .catch(function(error){
        if(error.response){
          console.log(error.response.data)
        }
        console.log(error);
      });
  }

    return (
      <>
        {user_id != null ? (
          <>
            <Nav>
              <NavLink to='/'>Portfolio</NavLink>
              <SearchBar placeholder="Search..." data={Tickers} />
              <NavBtn>
                <NavBtnLink to='/' onClick={logoutUser}>Log out</NavBtnLink>
              </NavBtn> 
            </Nav>
          </>
        ) : (
          <>
            <Nav>
              <NavBtn>
                <NavBtnLink to='/login'>Login</NavBtnLink>
              </NavBtn>
              <NavBtn>
                <NavBtnLink to='/register'>Register</NavBtnLink>
              </NavBtn>
            </Nav>
          </>
        )}
      </>
    )
}

export default Navbar;