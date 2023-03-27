import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Select from 'react-select';

import httpClient from "../httpClient";
import Navbar from '../common/navbar/index';
import StockChart from '../components/chart/index.js';
import { useGetStockDetailsQuery } from '../api/stockApi';

import '../assets/stock.css';

const Stock = () => {
  
  const { ticker } = useParams();
  const [price, setPrice] = useState(0);
  const [details, setDetails] = useState({ change: 0, prevClose: 0 });
  const [order, setOrder] = useState({ ticker: ticker, price: 50, quantity: 1});
  const [orderType, setOrderType] = useState("");
  const [priceType, setPriceType] = useState("")
  
  useEffect(() => {
    const fetchQuote = async () => {
      await axios.get(`https://finnhub.io/api/v1/quote?symbol=${ticker}&token=${process.env.REACT_APP_FINNHUB_API_KEY}`)
      .then(function(response){
        setPrice(response.data.c)
        setDetails({ ...details, change: response.data.d.toFixed(2), prevClose: response.data.pc})
      })
    }

    let interval = setInterval(async () => {
      await axios.get(`https://finnhub.io/api/v1/quote?symbol=${ticker}&token=${process.env.REACT_APP_FINNHUB_API_KEY}`)
      .then(function(response){
        setPrice(response.data.c.toFixed(2))
        setDetails({ ...details, change: response.data.d.toFixed(2)})
      })
    }, 2000)

    fetchQuote()

    return () => {clearInterval(interval)}
  }, [ticker])
  
  const { data, isFetching } = useGetStockDetailsQuery(ticker);
  if(isFetching) return <div>Loading...</div>
  const stockDetails = data["Global Quote"]

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(priceType === "market"){
      await axios.get(`https://finnhub.io/api/v1/quote?symbol=${ticker}&token=${process.env.REACT_APP_FINNHUB_API_KEY}`)
        .then(function(response){
          httpClient.post('http://localhost:5000/buy', {
          ticker: order.ticker,
          price: response.data.c,
          quantity: order.quantity 
        })
        .then(function(response){
            console.log(response);
        })
      })
    }
  }

  const priceTypeOptions = [
    {value: "limit", label: "Limit"},
    {value: "market", label: "Market"}
  ]

  return (
    <div className="stock">
      <Navbar />

      <div className="stock-header">
        <h3>{ticker}</h3>
        <h2>${price}</h2>
        <h6>{(details.change<0 ? "" : "+" ) + details.change} ({(parseFloat(stockDetails["10. change percent"]).toFixed(2) < 0 ? "" : "+") + parseFloat(stockDetails["10. change percent"]).toFixed(2)}%)</h6>
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
        </div>

      <div className="col2">
          <div className="stock-buy">
            <form onSubmit={handleSubmit}>
              <div className="order-type">
                  <input type="button" value="Buy" className="buy-button" name="orderType" onClick={(e) => setOrderType(e.target.value)}/>
                  <input type="button" value="Sell" className="sell-button" name="orderType" onClick={(e) => setOrderType(e.target.value)}/>
              </div>

              {orderType !== "" ? 
              <>
                <label>
                  SYMBOL
                  <input
                    type="text"
                    placeholder="Enter ticker"
                    onChange={(e) => setOrder(previousState => {
                      return { ...previousState, ticker: e.target.value}
                    })}
                    required
                  />
                </label>

                <label>
                  QUANTITY
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

                <label>ORDER TYPE
                  <div className="price-type">
                    <Select 
                      className="react-select-container" 
                      classNamePrefix="react-select"
                      options={priceTypeOptions} 
                      onChange={(selectedOption) => setPriceType(selectedOption.value)}
                    />
                  </div>
                </label>

                {priceType === "limit" ? 
                  <label>
                    LIMIT PRICE
                    <input
                      type="number"
                      placeholder="Enter price"
                      onChange={(e) => setOrder(previousState => {
                          return { ...previousState, price: e.target.value}
                      })}
                      required
                    />
                  </label>
                : null }

                <input type="submit" value={orderType} style={{"backgroundColor": orderType==="Buy" ? "green" : "red"}} />
              </>
              : null }
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Stock;