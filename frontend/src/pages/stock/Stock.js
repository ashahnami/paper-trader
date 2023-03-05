import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios'

import httpClient from "../../httpClient";
import Navbar from '../../common/navbar/index';
import StockChart from '../../components/chart/index.js';
import StockDetails from '../../components/stock/details.js';

import './style.css'
import '../../assets/stock.css';

const Stock = () => {
  
  const { ticker } = useParams();
  const [user, setUser] = useState({});
  const [price, setPrice] = useState(0);
  const [details, setDetails] = useState({ change: 0, prevClose: 0 });
  const [order, setOrder] = useState({ ticker: ticker, price: 50, quantity: 1})

  const logoutUser = async () => {

    await httpClient.post("http://localhost:5000/logout")
    .then(function(response){
      console.log(response);
      window.location.href="/";
    })
    .catch(function(error){
      if(error.response){
        console.log(error.response.data)
      }
      console.log(error);
    });
  }

  useEffect(() => {
    const fetchData = async () => {
      await httpClient.get("http://localhost:5000/@me")
      .then(function(response){
        setUser(response.data)
      })
      .catch(function(error){
        console.log('Error', error.message)
      })
    }
    
    fetchData();
    
    fetchStockData();
    
  }, [])
  
  const fetchStockData = () => {
    axios.get(`https://finnhub.io/api/v1/quote?symbol=${ticker}&token=${process.env.REACT_APP_FINNHUB_API_KEY}`)
    .then(function(response){
      setPrice(response.data.c)
      setDetails({ ...details, change: response.data.d, prevClose: response.data.pc})
    })
    .then(() => {
      setInterval(() => {
        axios.get(`https://finnhub.io/api/v1/quote?symbol=${ticker}&token=${process.env.REACT_APP_FINNHUB_API_KEY}`)
        .then(function(response){
          setPrice(response.data.c)
          setDetails({ ...details, change: response.data.d})
        })
      }, 5000);
    })
  }

  const handleSubmit = async (e) => {
        e.preventDefault();
        await httpClient.post('http://localhost:5000/buy', {
            ticker: order.ticker,
            price: price,
            quantity: order.quantity 
        })
        .then(function(response){
            console.log(response);
        })
        .catch(function(error){
            console.log(error);
        })
    }

  return (
    <div className="stock">
      <Navbar currentUser={user} logout={logoutUser} />
      <div className="grid-container">
        <div className="stock-header">
          <h3>{ticker}</h3>
          <h2>${price}</h2>
          <h6>{details.change}%</h6>
        </div>

        <div className="grid-item stock-chart"><StockChart ticker={ticker} /></div>
        {/* <div className="grid-item stock-details"><StockDetails ticker={ticker} /></div> */}

        <div className="stock-buy">
          <form onSubmit={handleSubmit}>
              <label>QUANTITY
                  <input
                      type="number"
                      placeholder="Enter quantity"
                      min="1"
                      onChange={(e) => setOrder(previousState => {
                          return { ...previousState, quantity: e.target.value}
                      })}
                      required
                  />
              </label>
              <input type="submit" value="Submit Order" />
          </form>
        </div>

      </div>
    </div>
  )
}

export default Stock;