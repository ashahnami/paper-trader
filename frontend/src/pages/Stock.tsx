import React, { useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';

import StockChart from '@/components/stock/Chart';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { addToWatchlist, checkInWatchlist, fetchProfile, removeFromWatchlist } from '@/api/userApi';
import {buyStock, getCompanyProfile, getStockQuote} from '@/api/stockApi';
import '../assets/stock.css';

interface Order {
  price: number;
  quantity: number;
}

const Stock = () => {
  let { state } = useLocation();
  const [quantity, setQuantity] = useState<number>(1);
  const client = useQueryClient();

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: () => fetchProfile(),
  });

  const { data: inWatchlist } = useQuery({
    queryKey: ['in_watchlist'],
    queryFn: () => checkInWatchlist(state.id),
  });

  const { data: companyProfile } = useQuery({
    queryKey: ['companyProfile'],
    queryFn: () => getCompanyProfile(state.id),
  })

  const { data: quote, isFetched: quoteFetched } = useQuery(({
    queryKey: ['quote'],
    queryFn: () => getStockQuote(state.id),
    refetchInterval: 5000,
  }))

  const { mutateAsync: buyStockMutation } = useMutation({
    mutationFn: (stock_id: number, quantity: number) => buyStock(stock_id, quantity),
  });

  const { mutateAsync: addToWatchlistMutation } = useMutation({
    mutationFn: addToWatchlist,
    onSuccess: () => {
      return client.invalidateQueries({ queryKey: ['in_watchlist'] });
    },
    onError: (error) => {
      console.log(error);
    }
  });

  const { mutateAsync: removeFromWatchlistMutation } = useMutation({
    mutationFn: removeFromWatchlist,
    onSuccess: () => {
      return client.invalidateQueries({ queryKey: ['in_watchlist'] });
    },
    onError: (error) => {
      console.log(error);
    }
  });

  const { ticker } = useParams();
  const [price, setPrice] = useState<number>(0);
  const [orderType, setOrderType] = useState<string>("Buy");
  const [positiveChange, setPositiveChange] = useState<boolean>(true);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await buyStockMutation(state.id, quantity)
  }

  return (
    <div className="stock">
      <div className="stock-header">
        <div className="info">
          <h3>{companyProfile?.ticker.toUpperCase()}</h3>
          <div>{companyProfile?.name.toUpperCase()}</div>
          <div>{companyProfile?.exchange.toUpperCase()}</div>
        </div>

        <div className="price">${quote?.c}</div>
        <div className="change" style={{ color: positiveChange ? 'green' : 'red' }}>
          {(positiveChange ? "+" : "") + quote?.d.toFixed(2)} ({(positiveChange ? "+" : "") + quote?.dp.toFixed(2)}%) <span style={{ color: 'black' }}>Today</span>
        </div>
      </div>

      <div className="stock-container">
        <div className="col1">

          <div className="grid-item stock-chart"><StockChart ticker={ticker} /></div>

          <div className="stock-details">
            <div className="stock-details-col">
              <div className="row">
                <div>Open</div>
                <div>{quote?.o.toFixed(2)}</div>
              </div>

              <div className="row">
                <div>Previous close</div>
                <div>{quote?.pc.toFixed(2)}</div>
              </div>
            </div>

            <div className="stock-details-col">
              <div className="row">
                <div>High</div>
                <div>{quote?.h.toFixed(2)}</div>
              </div>
              <div className="row">
                <div>Low</div>
                <div>{quote?.l.toFixed(2)}</div>
              </div>
            </div>

            <div className="stock-details-col">
              <div className="row">
                <div>Change percent</div>
                <div>{quote?.dp.toFixed(2)}%</div>
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
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      required
                  />

                </div>

                <div className="price">
                  <div>Market price</div>
                  <div>${quote?.c}</div>
                </div>

                <div className="cost">
                  <div>Estimated cost</div>
                  <div>~${(price * quantity).toFixed(2)}</div>
                </div>

                <input type="submit" value={orderType} />

                <div className="balance">${profile?.balance.toFixed(2)} available</div>
            </form>
          </div>

          <div className='watchlist'>
            {inWatchlist ? (
              <div onClick={() => {
                removeFromWatchlistMutation(state.id);
              }}>
                <BookmarkIcon className='watchlist-icon' />
              </div>
            ) : (
              <div onClick={() => {
                addToWatchlistMutation(state.id);
              }}>
                <BookmarkBorderIcon className='watchlist-icon' />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Stock;