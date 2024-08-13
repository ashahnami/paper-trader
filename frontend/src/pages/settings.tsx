import React, { useEffect, useState } from 'react';
import Navbar from '../common/navbar';
import '../assets/settings.css';
import { fetchProfile, changePassword } from '../api/userApi';
import { useMutation, useQuery } from '@tanstack/react-query';

const Settings = () => {
  const [username, setUsername] = useState<string>();

  const [oldPassword, setOldPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>("");

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: () => fetchProfile(),
  })

  const { mutateAsync: changePasswordMutation } = useMutation({
    mutationFn: changePassword,
    onSuccess: (data) => {
      console.log('Successfully changed password')
    },
    onError: () => {
      console.log('Could not change password')
    }
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
  }

  const changePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (newPassword !== confirmNewPassword) {
      console.log('Passwords do not match')
      return;
    }

    try {
      await changePasswordMutation({ oldPassword, newPassword });
    } catch (e) {
      console.log(e)
    }

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
    <div className='settings'>
        <Navbar />
        <div className='settingsContainer'>
            <h1>Settings</h1>

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

            <div className='changePassword'>
              <h3>Your password</h3>

              <form onSubmit={changePasswordSubmit}>
                <input
                  type="password"
                  name="oldPassword"
                  value={oldPassword}
                  placeholder="Enter old password"
                  onChange={(e) => setOldPassword(e.target.value)}
                  required
                />

                <input
                  type="password"
                  name="newPassword"
                  value={newPassword}
                  placeholder="Enter new password"
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />

                <input
                  type="password"
                  name="confirmNewPassword"
                  value={confirmNewPassword}
                  placeholder="Confirm new password"
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  required
                />             

                <input type="submit" value="Change Password" />
              </form>
            </div>
        </div>
    </div>
  )
}

export default Settings
