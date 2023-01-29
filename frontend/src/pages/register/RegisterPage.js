import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import httpClient from "../../httpClient";
import '../../assets/login.css';

const RegisterPage = () => {

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        await httpClient.post('http://localhost:5000/register', {
            username: username,
            email: email,
            password: password
        })
        .then(function(response){
            console.log(response);
            window.location.href="/login";
        })
        .catch(function(error){
            console.log(error);
        });

    };

  return (
    <form className="registerForm" onSubmit={handleSubmit}>

        <h3>Sign up</h3>
        <label>
            Username
            <input 
                type="text"
                placeholder="Username"
                onChange={(e) => setUsername(e.target.value)}
            />
        </label>

        <label>
            Email
            <input 
                type="text"
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
            />
        </label>

        <label>
            Password
            <input 
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
            />
        </label>

        <button type="submit">Sign up</button>

        <p>Already have an account? <Link to="/login" className="link">Sign in</Link></p>

    </form>
  )
}

export default RegisterPage;