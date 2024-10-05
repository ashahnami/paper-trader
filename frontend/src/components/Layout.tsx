import React from 'react'
import Navbar from './navbar'
import { Outlet, Navigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import '../assets/layout.css'

const Layout = () => {
  return (
    <div className='layout'>
      <div className='navbar'>
        <Navbar />
      </div>

      <div className='content'>
        <Outlet />
      </div>
    </div>
  )
}

const RequireAuth = () => {
    const { auth } : any = useAuth();

    if (!auth) return <Navigate to='/login' />
    else {
        return (
        <div className='layout'>
            <div className='navbar'>
            <Navbar />
            </div>

            <div className='content'>
            <Outlet />
            </div>
        </div>
        )
    }
}

export { Layout, RequireAuth };