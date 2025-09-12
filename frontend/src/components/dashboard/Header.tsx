import { useQuery } from '@tanstack/react-query';
import { fetchProfile } from '../../api/userApi';

import '../../assets/dashboard.scss';

const Header = () => {
    const { data: profile, isLoading } = useQuery({
      queryKey: ['profile'],
      queryFn: () => fetchProfile(),
    })

    if (isLoading) {
      return <span>Loading...</span>
    }

  return (
    <div className="portfolioHeaderContainer">
        <div className='welcome-message'>Welcome {profile?.username}!</div>
        <div className='balance-message'>Your balance is: ${profile?.balance.toFixed(2)}</div>
    </div>
  )
}

export default Header