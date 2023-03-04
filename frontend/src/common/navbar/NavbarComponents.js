import { NavLink as Link } from 'react-router-dom';
import styled from 'styled-components';

export const Nav = styled.nav`
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
  font-weight: 600;

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
  background: #DBFCFF;
  padding: 8px 16px;
  color: #black;
  outline: none;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  text-decoration: none;
  font-weight: 600;

  &:hover {
    transition: all 0.1s ease-in-out;
    background: #f4f3ee;
    color: #463f3a;
  }
`;