import "../assets/dashboard.scss";
import Watchlist from "../components/dashboard/Watchlist";
import News from '../components/dashboard/News';
import Positions from '../components/dashboard/Positions';
import {useQuery} from "@tanstack/react-query";
import {fetchProfile} from "../api/userApi";

const Dashboard = () => {
  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: () => fetchProfile(),
  })

  if (isLoading) {
    return <span>Loading...</span>
  }

  return (
    <div className="home">
      <div className="home-container">
        <div className="portfolioHeaderContainer">
          <div className='welcome-message'>Welcome {profile?.username}!</div>
          <div className='balance-message'>Your balance is: ${profile?.balance.toFixed(2)}</div>
        </div>

        <div className='positions card'>
          <h5 className='positions'>Positions</h5>
          <Positions />
        </div>

        <div className="bottom">
          <div className="watchlist card">
            <h5 className="header">Watchlist</h5>
            <Watchlist />
          </div>

          <div className="news card">
            <h5>Recent News</h5>
            <News />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
