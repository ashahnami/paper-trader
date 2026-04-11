import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import '../assets/login.scss';
import { useMutation } from '@tanstack/react-query';
import { login } from '../api/userApi';
import { useAuth } from '../context/AuthProvider';

const Login = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { setToken } : any = useAuth();

  const { mutateAsync: loginMutation } = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      localStorage.setItem("access_token", data.access_token)
      setToken(data.access_token);
      navigate('/');
    },
    onError: () => {
      setErrorMessage("Incorrect username or password");
    }
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await loginMutation({ username, password }); 
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    document.title = "Login";
  }, [])

  return (
    <div className="login">
      <div className="login-container">
        <form onSubmit={handleSubmit}>
          <h3>Log in</h3>

          <div className='content'>
            <div>
              <div>Username</div>
              <input 
                type="text"
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div>
              <div>Password</div>
              <input 
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {errorMessage !== "" ? <span className="error">{errorMessage}</span> : <div />}

          <button type="submit">Log In</button>
        
          <p className="pLink">Don't have an account? <Link to="/register" className="link">Sign up</Link></p>
        </form>
      </div>
    </div>
  )
};

export default Login;