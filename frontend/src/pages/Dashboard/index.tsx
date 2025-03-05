import "../../assets/home.css";
import Watchlist from '../Portfolio/portfolioWatchlist';
import News from '../../components/dashboard/News';
import Positions from '../../components/dashboard/Positions';
import Header from "../../components/dashboard/Header";

const Dashboard = () => {
  return (
    <div className="home">
      <div className="home-container">
        <Header />

        <div className='positions'>
          <h5 className='positions'>Positions</h5>
          <Positions />
        </div>

        <div className="watchlist">
          <h5 className="header">Watchlist</h5>
          <Watchlist />
        </div>

        <div className="news">
          <h5>Recent News</h5>
          <News />
        </div>
      </div>
    </div>
  )
}

export default Dashboard
