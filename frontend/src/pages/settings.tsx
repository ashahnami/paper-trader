import React, { useEffect, useState } from 'react';
import Navbar from '../common/navbar';
import '../assets/settings.css';
import { fetchProfile } from '../api/userApi';
import { useQuery } from '@tanstack/react-query';

const Settings = () => {
  const [input, setInput] = useState<string>();
  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: () => fetchProfile(),
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
  }
  
  useEffect(() => {
    if (profile) {
      setInput(profile?.username)
    }
  }, [isLoading])
  
  if(isLoading){
    return <span>Loading...</span>
  }

  return (
    <div className='settings'>
        <Navbar />
        <div className='settingsContainer'>
            <h1>Settings</h1>

            <div className="changeUsername">
              <h3>Your username</h3>
              
              <form onSubmit={handleSubmit}>
                <input type="text"
                  name="username" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)} 
                />

                <input type="submit" value="Change username" />
              </form>
            </div>
        </div>
    </div>
  )
}

export default Settings
