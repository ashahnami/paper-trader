import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import httpClient from "../httpClient";
import '../assets/login.css';

import { useDispatch } from 'react-redux'
import { login } from '../features/auth/authSlice'

const LoginPage = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch()

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
      dispatch(login(response.data.id));
      navigate('/');
    })
    .catch(function(error){
      if(error.response.status === 401){
        setErrorMessage("Incorrect username or password");
      }
    })
  }

  useEffect(() => {
    document.title = "Login";
  })

  return (
    <div className="login">
      <div className="login-container">
        <form onSubmit={handleSubmit}>

          <h3>Login</h3>
          <label>Username
              <input 
                type="text"
                placeholder="Username"
                onChange={(e) => setUsername(e.target.value)}
                required
              />
          </label>

          <label>Password
              <input 
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
          </label>

          {errorMessage !== "" ? <span className="error">{errorMessage}</span> : <div />}

          <button type="submit">Login</button>
        
          <p className="pLink">Don't have an account? <Link to="/register" className="link">Sign up</Link></p>
        </form>
      </div>
    </div>
  )
};

export default LoginPage;