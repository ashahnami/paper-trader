import { useQuery } from '@tanstack/react-query';
import { fetchProfile } from '../../api/userApi';

import './style.css';

const PortfolioHeader = () => {
    const { data: profile, isLoading } = useQuery({
      queryKey: ['profile'],
      queryFn: () => fetchProfile(),
    })

    if (isLoading) {
      return <span>Loading...</span>
    }

  return (
    <div className="portfolioHeaderContainer">
        <h3>Welcome {profile?.username}!</h3>
        <h4>Balance: {profile?.balance.toFixed(2)}</h4>
    </div>
  )
}

export default PortfolioHeader