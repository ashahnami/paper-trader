import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';

import { changePassword } from '../../api/userApi';
import '../../assets/settings.css';

export const ChangePassword = () => {

  const [oldPassword, setOldPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>("");
  const [error, setError] = useState<string>();
  const [showError, setShowError] = useState<boolean>(false);

  const { mutateAsync: changePasswordMutation } = useMutation({
    mutationFn: changePassword,
    onSuccess: (data) => {
        console.log('Successfully changed password');
        setShowError(false); 
    },
    onError: (error) => {
        setError("Could not change password");
        setShowError(true);
    }
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (newPassword !== confirmNewPassword) {
      setError('Passwords do not match');
      setShowError(true);
      return;
    }

    try {
      await changePasswordMutation({ oldPassword, newPassword });
    } catch (e) {
      setShowError(true);
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

            {showError ? (
                <span className='error'>{error}</span>
            ): null}
              
            </div>
  )
}
