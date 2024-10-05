import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro'

import httpClient from "../../api/httpClient";
import Navbar from '../../components/navbar';
import StockChart from './chart';

import '../../assets/stock.css';
import { useQuery } from '@tanstack/react-query';
import { fetchProfile, fetchWatchlist } from '../../api/userApi';
import { WatchlistItem } from '../../entities/Watchlist';

interface Order {
  price: number;
  quantity: number;
}

interface Quote {
  "c": number;
  "d": number;
  "dp": number;
  "h": number;
  "l": number;
  "o": number;
  "pc": number;
  "t": number;
}

interface Info {
  "country": string;
  "currency": string;
  "exchange": string;
  "ipo": string; 
  "marketCapitalization": number;
  "name": string;
  "phone": string;
  "shareOutstanding": number;
  "ticker": string;
  "weburl": string;
  "logo": string;
  "finnhubIndustry": string;
}

const Stock = () => {
  const { data: watchlist, isLoading: isLoadingWatchlist } = useQuery({
    queryKey: ['watchlist.py'],
    queryFn: () => fetchWatchlist(),
  })

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: () => fetchProfile(),
  })

  const { ticker } = useParams();
  const [price, setPrice] = useState<number>(0);
  const [details, setDetails] = useState<Quote>();
  const [order, setOrder] = useState<Order>();
  const [orderType, setOrderType] = useState<string>("Buy");
  const [positiveChange, setPositiveChange] = useState<boolean>(true);
  const [stockInfo, setStockInfo] = useState<Info>();
  const [inWatchlist, setInWatchlist] = useState(false);

  const fetchQuote = async () => {
    const { data: quote } = await axios.get<Quote>(`https://finnhub.io/api/v1/quote?symbol=${ticker}&token=${process.env.REACT_APP_FINNHUB_API_KEY}`);
    // const quote = {"c":216.24,"d":2.93,"dp":1.3736,"h":216.78,"l":211.98,"o":212.08,"pc":213.31,"t":1723233601}

    setPrice(parseFloat(quote.c.toFixed(2)));
    setDetails(quote);

    if(quote.d < 0){
      setPositiveChange(false);
    }
  }

  const fetchStockInfo = async () => {
    const { data: info } = await axios.get<Info>(`https://finnhub.io/api/v1/stock/profile2?symbol=${ticker}&token=${process.env.REACT_APP_FINNHUB_API_KEY}`);
    // const info = {"country":"US","currency":"USD","estimateCurrency":"USD","exchange":"NASDAQ NMS - GLOBAL MARKET","finnhubIndustry":"Technology","ipo":"1980-12-12","logo":"https://static2.finnhub.io/file/publicdatany/finnhubimage/stock_logo/AAPL.png","marketCapitalization":3287742.607581,"name":"Apple Inc","phone":"14089961010","shareOutstanding":15334.08,"ticker":"AAPL","weburl":"https://www.apple.com/"}

    setStockInfo(info);
  }

  const addToWatchlist = () => {
    return;
    httpClient.post("/addwatchlist", {
      ticker: ticker
    })
    setInWatchlist(true);
  }

  const checkInWatchlist = async () => {
    console.log('watchlist', watchlist)
    watchlist?.forEach((item: WatchlistItem) => {
      if(item.stockSymbol === ticker){
        setInWatchlist(true);
      }
    })
  }

  const removeFromWatchlist = () => {
    return;
    httpClient.post("/removewatchlist", {
      ticker: ticker
    })
    setInWatchlist(false);
  }
  
  useEffect(() => {
    
    fetchQuote();
    let interval = setInterval(async () => { fetchQuote() }, 4000)
    
    fetchStockInfo();

    if (!isLoadingWatchlist) {
      checkInWatchlist();
    }
    
    return () => {clearInterval(interval)}
  }, [ticker, isLoadingWatchlist])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { data: quote } = await axios.get<Quote>(`https://finnhub.io/api/v1/quote?symbol=${ticker}&token=${process.env.REACT_APP_FINNHUB_API_KEY}`)
    // const quote = {"c":216.24,"d":2.93,"dp":1.3736,"h":216.78,"l":211.98,"o":212.08,"pc":213.31,"t":1723233601}

    const latestPrice = quote.c

    httpClient.post('/buy', {
      ticker: ticker,
      price: latestPrice,
      quantity: order?.quantity 
    })
    .then(function(response){
        console.log(response);
    })
  }

  return (
    <div className="stock">
      <div className="stock-header">
        <div className="info">
          <h3>{ticker}</h3>
          <div>{stockInfo?.name.toUpperCase()}</div>
          <div>{stockInfo?.exchange.toUpperCase()}</div>
        </div>

        <div className="price">${price}</div>
        <div className="change" style={{ color: positiveChange ? 'green' : 'red' }}>
          {(positiveChange ? "+" : "") + details?.d.toFixed(2)} ({(positiveChange ? "+" : "") + details?.dp.toFixed(2)}%) <span style={{ color: 'black' }}>Today</span>
        </div>
      </div>

      <div className="stock-container">
        <div className="col1">

          <div className="grid-item stock-chart"><StockChart ticker={ticker} /></div>

          <div className="stock-details">
            <div className="stock-details-col">
              <div className="row">
                <div>Open</div>
                <div>{details?.o.toFixed(2)}</div>
              </div>

              <div className="row">
                <div>Previous close</div>
                <div>{details?.pc.toFixed(2)}</div>
              </div>
            </div>

            <div className="stock-details-col">
              <div className="row">
                <div>High</div>
                <div>{details?.h.toFixed(2)}</div>
              </div>
              <div className="row">
                <div>Low</div>
                <div>{details?.l.toFixed(2)}</div>
              </div>
            </div>

            <div className="stock-details-col">
              <div className="row">
                <div>Change percent</div>
                <div>{details?.dp.toFixed(2)}%</div>
              </div>
            </div>
          </div>

          {/* <div className="stock-description">
            <h2>About {ticker}</h2>
            {description}
          </div> */}

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
                      onChange={(e) => setOrder((previousState: any) => {
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
                  {order && <div>${(price * order.quantity).toFixed(2)}</div>}
                </div>

                <input type="submit" value={orderType} />

                <div className="balance">${profile?.balance.toFixed(2)} available</div>
            </form>
          </div>

          <div className='watchlist'>
            {inWatchlist ? (
              <FontAwesomeIcon icon={icon({name: 'bookmark', family: 'classic', style: 'solid'})} onClick={removeFromWatchlist} className='watchlistIcon' />
            ) : (
              <FontAwesomeIcon icon={icon({name: 'bookmark', family: 'classic', style: 'regular'})} onClick={addToWatchlist} className='watchlistIcon' />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Stock;