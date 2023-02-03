import { NavLink as Link } from 'react-router-dom';
import styled from 'styled-components';

export const Nav = styled.nav`
  background: #463F3A;
  height: 60px;
  display: flex;
  justify-content: flex-end;
  padding: 0.2rem;
  z-index: 10;
  margin-bottom: 10px;
  align-items: center;
`;

export const NavLink = styled(Link)`
  color: #f4f3ee;
  margin-right: auto;
  display: flex;
  align-items: center;
  text-decoration: none;
  padding: 0 1rem;
  height: 100%;
  cursor: pointer;

  &.active {
    color: #f4f3ee;
  }
`;

export const NavBtn = styled.nav`
  display: flex;
  align-items: center;
  margin-right: 0.5rem;
  margin-left: 0.5rem;
`;

export const NavBtnLink = styled(Link)`
  border-radius: 4px;
  background: #e0afa0;
  padding: 8px 16px;
  color: #f4f3ee;
  outline: none;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  text-decoration: none;

  &:hover {
    transition: all 0.1s ease-in-out;
    background: #f4f3ee;
    color: #463f3a;
  }
`;