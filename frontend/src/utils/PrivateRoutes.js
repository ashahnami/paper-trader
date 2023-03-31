import React, { useState } from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import httpClient from '../httpClient'

const PrivateRoutes = () => {
    
    const [isLoading, setIsLoading] = useState(true) 
    const [loggedIn, setLoggedIn] = useState() 

    httpClient.get("http://localhost:5000/@me")
    .then(function(response){
        setLoggedIn(true)
        setIsLoading(false)
    })
    .catch(function(error){
        setLoggedIn(false)
        setIsLoading(false)
    })

    if(isLoading){
        return <div></div>
    }

    return (
        loggedIn ? <Outlet /> : <Navigate to="/login" />
    )
}

export default PrivateRoutes;
