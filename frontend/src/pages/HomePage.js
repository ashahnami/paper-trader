import React, { useState, useEffect } from 'react';
import httpClient from "../httpClient";

const HomePage = () => {

  const [user, setUser] = useState({})

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
    <div>
      {user.id != null ? (
        <div>
          <p>Logged in</p>
          <p>ID: {user.id}</p>
          <p>Username: {user.username}</p>
          <button onClick={logoutUser}>Logout</button>
        </div>
      ) : (
        <div>
          <p>Not logged in</p>
          <a href="/login"><button>Login</button></a>
          <a href="/register"><button>Register</button></a>
        </div>
      )}
    </div>
  )
}

export default HomePage