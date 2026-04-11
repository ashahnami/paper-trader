import "../assets/dashboard.scss";
import Watchlist from "../components/dashboard/Watchlist";
import News from '../components/dashboard/News';
import Positions from '../components/dashboard/Positions';
import Header from "../components/dashboard/Header";

const Dashboard = () => {
  return (
    <div className="home">
      <div className="home-container">
        <Header />

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
