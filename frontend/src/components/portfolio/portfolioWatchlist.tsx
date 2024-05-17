import { useQuery } from '@tanstack/react-query'
import { fetchWatchlist } from '../../api/userApi'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { WatchlistItem } from '../../entities/Watchlist';
import axios from 'axios';

interface Quote {
  "c": number;
  "dp": number;
  "h": number;
  "l": number;
  "o": number;
  "pc": number;
  "t": number;
}

const Watchlist = () => {
    const { data: watchlist, isLoading } = useQuery({
      queryKey: ['watchlist'],
      queryFn: () => fetchWatchlist(),
    })

    const navigate = useNavigate();
    const [quotes, setQuotes] = useState<Quote[]>();

    const fetchWatchlistPrices = async () => {
      const requests: any = watchlist?.map((item: WatchlistItem) => 
        axios.get(`https://finnhub.io/api/v1/quote?symbol=${item.stockSymbol}&token=${process.env.REACT_APP_FINNHUB_API_KEY}`)
        .then(function(response) {
          return response.data;
        })
      );

      const responses: any = await Promise.all(requests);
      setQuotes(responses);
      console.log(responses)
    }

    useEffect(() => {
      if (!isLoading) {
        fetchWatchlistPrices();
      }
    }, [isLoading])

    if (isLoading) {
      return <span>Loading...</span>
    }

    return (
      <div>
        {isLoading ? "Fetching watchlist" : (
          <table>
            <thead>
              <tr>
                <th>SYMBOL</th>
                <th>LATEST PRICE</th>
                <th>CHANGE (%)</th>
              </tr>
            </thead>

            <tbody>
              {quotes && watchlist?.map((watchlistItem: WatchlistItem, index: number) => (
                <tr key={index} onClick={() => navigate(`/stock/${watchlistItem.stockSymbol}`)}>
                  <td>{watchlistItem.stockSymbol}</td>
                  <td>{quotes[index]?.c?.toFixed(2)}</td>
                  <td style={{ 
                    color: quotes[index]?.dp < 0 ? 'red' : 'green'
                  }}>{quotes[index]?.dp?.toFixed(2)}</td>
                </tr>
              ))}

              {watchlist?.length === 0 ? (
                <tr>
                  <td colSpan={3}>No stocks in watchlist</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        )}
      </div>
    )
}

export default Watchlist;