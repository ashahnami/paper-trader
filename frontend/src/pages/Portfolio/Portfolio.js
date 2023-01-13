import React, { useState, useEffect } from 'react';
import httpClient from "../../httpClient";

import Navbar from "../../components/Navbar/index.js";

const Portfolio = () => {

  const [user, setUser] = useState({});

  const logoutUser = async () => {

    await httpClient.post("http://localhost:5000/logout")
    .then(function(response){
      console.log(response);
      window.location.href="/";
    })
    .catch(function(error){
      if(error.response){
        console.log(error.response.data)
      }
      console.log(error);
    });
  }

  useEffect(() => {
    const fetchData = async () => {
      await httpClient.get("http://localhost:5000/@me")
      .then(function(response){
        setUser(response.data)
      })
      .catch(function(error){
        console.log('Error', error.message)
      })
    }

    fetchData();

  }, [])

  return (
    <>
      <Navbar currentUser={user} logout={logoutUser} />
      
      {user.id != null ? (
        <>
          <p>Logged in</p>
          <p>ID: {user.id}</p>
          <p>Username: {user.username}</p>
        </>
      ) : null}

    </>
  )
}

export default Portfolio; 