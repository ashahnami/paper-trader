import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import Navbar from "../common/navbar/index";
import "../assets/home.css";

const Home = () => {

  const [news, setNews] = useState([{}]);

  const navigate = useNavigate();

  const fetchNews = async () => {
    const { data } = await axios.get(`https://finnhub.io/api/v1/news?category=general&token=${process.env.REACT_APP_FINNHUB_API_KEY}`);
    setNews(data);
  }

  useEffect(() => {
    document.title = "Home";
    fetchNews();
  }, [])

  return (
    <div className="home">
      <Navbar />
      <div className="home-container">
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
