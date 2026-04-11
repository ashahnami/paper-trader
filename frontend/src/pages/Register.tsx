import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';

import httpClient from "../api/httpClient";
import '../assets/login.scss';
import { register } from '../api/userApi';

const Register = () => {
    const navigate = useNavigate();

    const [errorMessage, setErrorMessage] = useState<string>("");
    const [username, setUsername] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);

    const { mutateAsync: registerMutation } = useMutation({
        mutationFn: register,
        onSuccess: () => {
            navigate('/login');
        },
        onError: () => {
            setErrorMessage("Username/Email already exists");
        }
    })

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            await registerMutation({ username, email, password });
        } catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        document.title = "Register";

        const fetchDetails = async () => {
            try {
                await httpClient.get('/api/auth/@me');
                navigate('/');
            } catch (error) {
                setLoading(false);
            }
        }

        fetchDetails();
    })

    if (loading) {
        return <div></div>
    }

  return (
    <div className="register">
        <div className="register-container">
            <form onSubmit={handleSubmit}>
                <h3>Sign up</h3>

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
                        <div>Email</div>
                        <input 
                            type="email"
                            onChange={(e) => setEmail(e.target.value)}
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

                <button type="submit">Sign Up</button>

                <p className="pLink">Already have an account? <Link to="/login" className="link">Sign in</Link></p>

            </form>
        </div>
    </div>
  )
}

export default Register;