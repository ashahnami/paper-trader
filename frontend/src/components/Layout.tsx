import React from 'react'
import Navbar from './navbar'
import { Outlet, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthProvider'
import '../assets/layout.css'

const Layout = () => {
  return (
    <div className='layout'>
      <div className='content'>
        <Outlet />
      </div>
    </div>
  )
}

const RequireAuth = () => {
    const { token } : any = useAuth();

    if (!token) return <Navigate to='/login' />
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