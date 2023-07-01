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
    setWatchlist(data);

    const requests = data.map(item => 
      axios.get(`https://finnhub.io/api/v1/quote?symbol=${item.stockSymbol}&token=${process.env.REACT_APP_FINNHUB_API_KEY}`)
    );

    const responses = await Promise.all(requests);
    setQuotes(responses);
    setIsFetching(false);
  }

  useEffect(() => {
    document.title = "Home";
    fetchWatchlist();
    fetchNews();
  }, [])

  return (
    <div className="home">
      <Navbar />
      <div className="home-container">
        <div className="watchlist">

          <h5 className="header">Watchlist</h5>

          {isFetching ? "Fetching watchlist" : (
          <table>
            <thead>
              <tr>
                <th>SYMBOL</th>
                <th>LATEST PRICE</th>
                <th>CHANGE (%)</th>
              </tr>
            </thead>

            <tbody>
              {watchlist.map((watchlistItem, index) => (
                <tr key={index} onClick={() => navigate(`/stock/${watchlistItem.stockSymbol}`)}>
                  <td>{watchlistItem.stockSymbol}</td>
                  <td>{parseFloat(quotes[index].data.c).toFixed(2)}</td>
                  <td>{parseFloat(quotes[index].data.dp).toFixed(2)}</td>
                </tr>
              ))}

              {watchlist.length === 0 ? (
                <tr>
                  <td colSpan={3}>No stocks in watchlist</td>
                </tr>
              ) : null}
            </tbody>
          </table>
          )}
        </div>

        <div className="news">
          <h5>Recent News</h5>
          <table>
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
