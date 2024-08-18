import Navbar from '../common/navbar';
import { ChangePassword } from '../components/settings/ChangePassword';
import { ChangeUsername } from '../components/settings/ChangeUsername';
import '../assets/settings.css';

const Settings = () => {
  return (
    <div className='settings'>
        <Navbar />

        <div className='settingsContainer'>
            <h1>Settings</h1>

            <ChangeUsername />

            <ChangePassword />
        </div>
    </div>
  )
}

export default Settings;
