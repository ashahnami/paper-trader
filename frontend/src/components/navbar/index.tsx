import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ShowChartIcon from '@mui/icons-material/ShowChart';

import SearchBar from '../search';
import '../../assets/navbar.scss';
import { fetchProfile, logout } from '../../api/userApi'
import { useMutation, useQuery } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthProvider';

const Navbar = () => {
  const { setToken } : any = useAuth();

  const { data: user, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: () => fetchProfile(),
  })

  const { mutateAsync: logoutMutation } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      setToken(null);
      navigate("/login");
    },
    onError: () => {
      console.log("unable to log out");
    }
  })

  const navigate = useNavigate()
  const [dropdown, setDropdown] = useState<boolean>(false)

  let accountMenuRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let handler = (event: any) => {
      if(!accountMenuRef.current?.contains(event.target)){
        setDropdown(false);
      }
    }

    document.addEventListener("mousedown", handler);

    return() => {
      document.removeEventListener("mousedown", handler);
    }
  })

  return (
    <nav>
      <div className='links'>
        <Link to="/" className='home-link'><ShowChartIcon></ShowChartIcon></Link>
      </div>

      <SearchBar />

      <div className="account" ref={accountMenuRef}>
        <AccountCircleIcon className="icon" onClick={() => setDropdown(!dropdown)} />
        {dropdown ? 
          <div className="dropdown">

            {!isLoading ? 
              <div className='details'>
                <div className='username'>{user?.username}</div>
                <div className='email'>{user?.email}</div>
              </div>
            : null}

            <div className='links'>
              <hr className='divider'></hr>

              <div onClick={() => navigate('/settings')}>Settings</div>

              <hr className='divider' />

              <div onClick={() => logoutMutation()}>Log Out</div>
            </div>
          </div> 
        : null}
      </div>
    </nav>
  );
};

export default Navbar;
