import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios'

import httpClient from "../../httpClient";
import Navbar from '../../common/navbar/index';
import StockChart from '../../components/chart/index.js';
import { useGetStockDetailsQuery } from '../../api/stockApi';

import './style.css'
import '../../assets/stock.css';

const Stock = () => {
  
  const { ticker } = useParams();
  const [price, setPrice] = useState(0);
  const [details, setDetails] = useState({ change: 0, prevClose: 0 });
  const [order, setOrder] = useState({ ticker: ticker, price: 50, quantity: 1})
  
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
  
  useEffect(() => {
    fetchStockData();
  }, [])
  
  const { data, isFetching } = useGetStockDetailsQuery(ticker);
  if(isFetching) return <div>Loading...</div>
  const stockDetails = data["Global Quote"]


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
      <Navbar />
      <div className="grid-container">
        <div className="stock-header">
          <h3>{ticker}</h3>
          <h2>${price}</h2>
          <h6>{details.change}%</h6>
        </div>

        <div className="grid-item stock-chart"><StockChart ticker={ticker} /></div>

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

        <div className="stock-details">
          <div className="stock-details-row">
            <h5>Open</h5>
            <h3>{parseFloat(stockDetails["02. open"]).toFixed(2)}</h3>
          </div>

          <div className="stock-details-row">
            <h5>High</h5>
            <h3>{parseFloat(stockDetails["03. high"]).toFixed(2)}</h3>
          </div>

          <div className="stock-details-row">
            <h5>Low</h5>
            <h3>{parseFloat(stockDetails["04. low"]).toFixed(2)}</h3>
          </div>

          <div className="stock-details-row">
            <h5>Volume</h5>
            <h3>{parseInt(stockDetails["06. volume"]).toLocaleString()}</h3>
          </div>

          <div className="stock-details-row">
            <h5>Previous close</h5>
            <h3>{parseFloat(stockDetails["08. previous close"]).toFixed(2)}</h3>
          </div>

          <div className="stock-details-row">
            <h5>Change percent</h5>
            <h3>{parseFloat(stockDetails["10. change percent"]).toFixed(2)}%</h3>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Stock;