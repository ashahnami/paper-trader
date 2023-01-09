import React from 'react';

import {
  Nav,
  NavLink,
  NavBtn,
  NavBtnLink
} from './NavbarComponents';

const Navbar = ({currentUser, logout}) => {
    return (
      <>
        {currentUser.id != null ? (
          <>
            <Nav>
              <NavLink to='/'>Portfolio</NavLink>
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