import Navbar from '../../components/navbar';
import { ChangePassword } from './ChangePassword';
import { ChangeUsername } from './ChangeUsername';
import '../../assets/settings.css';

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
