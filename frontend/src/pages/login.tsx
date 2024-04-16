import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import httpClient from "../httpClient";
import '../assets/login.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await httpClient.post('/login', {
      username: username,
      password: password
    })
    .then(function(response){
      // dispatch(login(response.data.id));
      navigate('/');
    })
    .catch(function(error){
      // if(error.response.status === 401){
        setErrorMessage("Incorrect username or password");
      // }
    })
  }

  useEffect(() => {
    document.title = "Login";

    httpClient.get("/checklogin")
    .then(function(response){
      if(response.data["logged_in"]){
        navigate("/")
      }
    })
    .catch(function(error){
      console.log(error)
    })
  }, [])

  return (
    <div className="login">
      <div className="login-container">
        <form onSubmit={handleSubmit}>

          <h3>Login</h3>
          <input 
            type="text"
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <input 
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {errorMessage !== "" ? <span className="error">{errorMessage}</span> : <div />}

          <button type="submit">Login</button>
        
          <p className="pLink">Don't have an account? <Link to="/register" className="link">Sign up</Link></p>
        </form>
      </div>
    </div>
  )
};

export default LoginPage;