import React, { useState } from 'react'
import axios from 'axios';

const LoginPage = () => {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    await axios.post('http://localhost:5000/login', {
      username: username,
      password: password
    })
    .then(function(response){
      console.log(response);
      // handle token
    })
    .catch(function(error){
      console.log(error);
    });

  };

  return (
    <div>
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
};

export default LoginPage;