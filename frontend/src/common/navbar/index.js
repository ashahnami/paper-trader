import React from 'react';

import {
  Nav,
  NavLink,
  NavBtn,
  NavBtnLink
} from './NavbarComponents';

import SearchBar from '../search/SearchBar';
import Tickers from '../search/Tickers.json';

const Navbar = ({currentUser, logout}) => {
    return (
      <>
        {currentUser.id != null ? (
          <>
            <Nav>
              <NavLink to='/'>Portfolio</NavLink>
              <SearchBar placeholder="Search..." data={Tickers} />
              <NavBtn>
                <NavBtnLink to='/' onClick={logout}>Log out</NavBtnLink>
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