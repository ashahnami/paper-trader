import React, { useState } from 'react'
import axios from 'axios'

const RegisterPage = () => {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        axios.post('http://localhost:5000/register', {
            username: username,
            password: password
        })
        .then(function(response){
            console.log(response);
        })
        .catch(function(error){
            console.log(error);
        });

    };

  return (
    <div>
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>

            <label>
                Username:
                <input 
                    type="text"
                    onChange={(e) => setUsername(e.target.value)}
                />
            </label>

            <label>
                Password:
                <input 
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                />
            </label>

            <input type="submit" />

        </form>
    </div>
  )
}

export default RegisterPage;