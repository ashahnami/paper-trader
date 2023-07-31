import React, { useEffect, useState } from 'react'
import Navbar from '../common/navbar'
import '../assets/settings.css'
import { useGetCurrentUserQuery } from '../api/userApi'

const Settings = () => {
  const [input, setInput] = useState("")
  const { data: user, isLoading } = useGetCurrentUserQuery()

  const handleSubmit = async (e) => {
    e.preventDefault()
  }
  
  useEffect(() => {
    if(!isLoading){
      setInput(user.username)
    }
  }, [isLoading, user])
  
  if(isLoading){
    return <div>Loading...</div>
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
