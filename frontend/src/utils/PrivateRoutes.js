import React, { useState } from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import httpClient from '../httpClient'

const PrivateRoutes = () => {
    
    const [isLoading, setIsLoading] = useState(true) 
    const [loggedIn, setLoggedIn] = useState() 

    httpClient.get("http://localhost:5000/checklogin")
    .then(function(response){
        setLoggedIn(response.data["logged_in"])
        setIsLoading(false)
    })
    .catch(function(error){
        console.error(error);
        setIsLoading(false);
    })

    if(isLoading){
        return <div></div>
    }

    return (
        loggedIn ? <Outlet /> : <Navigate to="/login" />
    )
}

export default PrivateRoutes;
