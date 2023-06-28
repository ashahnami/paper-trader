import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import Navbar from "../common/navbar/index";
import "../assets/home.css";
import httpClient from '../httpClient';

const Home = () => {

  const [news, setNews] = useState([{}]);
  const [watchlist, setWatchlist] = useState([]);
  const [quotes, setQuotes] = useState([{}]);
  const [isFetching, setIsFetching] = useState(true);

  const navigate = useNavigate();

  const fetchNews = async () => {
    const { data } = await axios.get(`https://finnhub.io/api/v1/news?category=general&token=${process.env.REACT_APP_FINNHUB_API_KEY}`);
    setNews(data);
  }

  const fetchWatchlist = async () => {
    const { data } = await httpClient.get("http://localhost:5000/watchlist");
    setWatchlist(data, setIsFetching(false));
  }

  useEffect(() => {
    document.title = "Home";
    fetchWatchlist();
    fetchNews();
  }, [])

  if(isFetching){
    return <div>Loading...</div>
  }

  return (
    <div className="home">
      <Navbar />
      <div className="home-container">
        <div className="watchlist">
          <table>
            <thead>
              <tr>
                <th>SYMBOL</th>
                <th>LATEST PRICE</th>
                <th>CHANGE (%)</th>
              </tr>
            </thead>

            <tbody>
              {isFetching ? "Loading" : watchlist.map((watchlistItem, index) => (
                <tr key={index} onClick={() => navigate(`/stock/${watchlistItem.stockSymbol}`)}>
                  <td>{watchlistItem.stockSymbol}</td>
                  <td>55.7</td>
                  <td>3.26</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="news">
          <table>
            <thead>
              <tr>
                <th colSpan={2}>NEWS</th>
              </tr>
            </thead>

            <tbody>
              {news.slice(0, 5).map((newsItem, index) => (
                <tr key={index} onClick={() => window.location.replace(newsItem.url)}>
                  <td className="image">
                    <img src={newsItem.image} width={200} />
                  </td>

                  <td className="headline">
                    <div>{newsItem.headline}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Home
