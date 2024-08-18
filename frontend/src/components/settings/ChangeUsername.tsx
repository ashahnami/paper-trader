import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react'

import { fetchProfile } from '../../api/userApi';
import '../../assets/settings.css';

export const ChangeUsername = () => {
  const [username, setUsername] = useState<string>();
  
  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: () => fetchProfile(),
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
  }

  useEffect(() => {
    if (profile) {
      setUsername(profile?.username)
    }
  }, [isLoading])
  
  if(isLoading){
    return <span>Loading...</span>
  }

  return (
    <div className="changeUsername">
        <h3>Your username</h3>
              
        <form onSubmit={handleSubmit}>
            <input type="text"
                name="username" 
                value={username}
                onChange={(e) => setUsername(e.target.value)} 
            />

            <input type="submit" value="Change username" />
        </form>
    </div>
  )
}
