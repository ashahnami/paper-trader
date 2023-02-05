import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import httpClient from "../../httpClient";
import '../../assets/login.css';

const LoginPage = () => {

  const [errorMessage, setErrorMessage] = useState("");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    await httpClient.post('http://localhost:5000/login', {
      username: username,
      password: password
    })
    .then(function(response){
      console.log(response);
      window.location.href="/";
    })
    .catch(function(error){
      if(error.response.status === 401){
        setErrorMessage("Incorrect username or password");
      }
    });

  };

  return (
      <form className="loginForm" onSubmit={handleSubmit}>

        <h3>Log in</h3>
        <label>
            Username
            <input 
                type="text"
                placeholder="Username"
                onChange={(e) => setUsername(e.target.value)}
                required
            />
        </label>

        <label>
            Password
            <input 
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                required
            />
        </label>

        {errorMessage !== "" ? <p className="errorMessage">{errorMessage}</p> : <div />}

        <button type="submit">Log In</button>
      
        <p className="pLink">Don't have an account? <Link to="/register" className="link">Sign up</Link></p>

      </form>
  )
};

export default LoginPage;