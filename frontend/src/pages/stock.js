import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import httpClient from "../httpClient";
import Navbar from '../common/navbar/index';
import StockChart from '../components/chart/index.js';
import { useGetStockDetailsQuery } from '../api/stockApi';
// import { useGetCurrentUserQuery } from '../api/userApi';

import '../assets/stock.css';

const Stock = () => {
  
  const { ticker } = useParams();
  const [price, setPrice] = useState(0);
  const [details, setDetails] = useState({ change: 0, prevClose: 0 });
  const [order, setOrder] = useState({ price: 50, quantity: 1});
  const [orderType, setOrderType] = useState("Buy");
  const [isLoading, setIsLoading] = useState(true);
  const [balance, setBalance] = useState(0.00);
  const [description, setDescription] = useState("");

  const fetchBalance = () => {
    httpClient.get("http://localhost:5000/@me")
    .then(function(response){
      setBalance(response.data.balance)
      setIsLoading(false)
    })
    .catch(function(error){
      console.log(error)
      setIsLoading(false)
    })
  }

  const fetchQuote = async () => {
    await axios.get(`https://finnhub.io/api/v1/quote?symbol=${ticker}&token=${process.env.REACT_APP_FINNHUB_API_KEY}`)
    .then(function(response){
      setPrice(response.data.c)
      setDetails({ ...details, change: response.data.d.toFixed(2), prevClose: response.data.pc})
    })
  }

  const fetchDescription = async () => {
    await axios.get(`https://www.alphavantage.co/query?function=OVERVIEW&symbol=${ticker}&apikey=${process.env.API_KEY}`)
      .then(function(response){
        setDescription(response.data.Description);
      })
  }
  
  useEffect(() => {
    
    let interval = setInterval(async () => {
      await axios.get(`https://finnhub.io/api/v1/quote?symbol=${ticker}&token=${process.env.REACT_APP_FINNHUB_API_KEY}`)
      .then(function(response){
        setPrice(response.data.c.toFixed(2))
        setDetails({ ...details, change: response.data.d.toFixed(2)})
      })
    }, 2000)
    
    fetchBalance()
    fetchQuote()
    fetchDescription()
    
    return () => {clearInterval(interval)}
  }, [ticker])
  
  const { data, isFetching } = useGetStockDetailsQuery(ticker);
  if(isFetching) return <div>Loading...</div>
  const stockDetails = data["Global Quote"]

  const handleSubmit = async (e) => {
    e.preventDefault();

    await axios.get(`https://finnhub.io/api/v1/quote?symbol=${ticker}&token=${process.env.REACT_APP_FINNHUB_API_KEY}`)
      .then(function(response){
        httpClient.post('http://localhost:5000/buy', {
          ticker: ticker,
          price: response.data.c,
          quantity: order.quantity 
        })
        .then(function(response){
            console.log(response);
            fetchBalance()
        })
    })
  }

  return (
    <div className="stock">
      <Navbar />

      <div className="stock-header">
        <h3>{ticker}</h3>
        <div className="price">${price}</div>
        <div className="change">{(details.change<0 ? "" : "+" ) + details.change} ({(parseFloat(stockDetails["10. change percent"]) < 0 ? "" : "+") + parseFloat(stockDetails["10. change percent"]).toFixed(2)}%) <span>Today</span></div>
      </div>

      <div className="stock-container">
        <div className="col1">

          <div className="grid-item stock-chart"><StockChart ticker={ticker} /></div>

          <div className="stock-details">
            <div className="stock-details-col">
              <div className="row">
                <div>Open</div>
                <div>{parseFloat(stockDetails["02. open"]).toFixed(2)}</div>
              </div>

              <div className="row">
                <div>Previous close</div>
                <div>{parseFloat(stockDetails["08. previous close"]).toFixed(2)}</div>
              </div>
            </div>

            <div className="stock-details-col">
              <div className="row">
                <div>High</div>
                <div>{parseFloat(stockDetails["03. high"]).toFixed(2)}</div>
              </div>
              <div className="row">
                <div>Low</div>
                <div>{parseFloat(stockDetails["04. low"]).toFixed(2)}</div>
              </div>
            </div>

            <div className="stock-details-col">
              <div className="row">
                <div>Change percent</div>
                <div>{parseFloat(stockDetails["10. change percent"]).toFixed(2)}%</div>
              </div>
              <div className="row">
                <div>Volume</div>
                <div>{parseInt(stockDetails["06. volume"]).toLocaleString()}</div>
              </div>
            </div>
          </div>

          <div className="stock-description">
            <h2>About {ticker}</h2>
            {description}
          </div>

        </div>

      <div className="col2">
          <div className="stock-buy">
            <form onSubmit={handleSubmit}>
                <h3>Buy {ticker}</h3>

                <div className="quantity">
                  <div>Shares</div>

                  <input
                      type="number"
                      defaultValue={1}
                      min="1"
                      onChange={(e) => setOrder(previousState => {
                          return { ...previousState, quantity: e.target.value}
                      })}
                      required
                  />
                </div>

                <div className="price">
                  <div>Market price</div>
                  <div>${price}</div>
                </div>

                <div className="cost">
                  <div>Estimated cost</div>
                  <div>${(price * order.quantity).toFixed(2)}</div>
                </div>

                <input type="submit" value={orderType} />

                { isLoading ? "Loading balance" :
                  <div className="balance">${balance.toFixed(2)} available</div>
                }
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Stock;