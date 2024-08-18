import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';

import { changePassword } from '../../api/userApi';
import '../../assets/settings.css';

export const ChangePassword = () => {

  const [oldPassword, setOldPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>("");

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

  return (
    <div className='changePassword'>
              <h3>Your password</h3>

              <form onSubmit={handleSubmit}>
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
  )
}
