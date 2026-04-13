import { useQuery } from '@tanstack/react-query'
import { fetchWatchlist } from '../../api/userApi'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios';
import { WatchedStockPublic } from "../../entities/types";

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
      queryKey: ['watchlist.py'],
      queryFn: () => fetchWatchlist(),
    })

    const navigate = useNavigate();
    const [quotes, setQuotes] = useState<Quote[]>();

    const fetchWatchlistPrices = async () => {
      const requests: any = watchlist?.map((item: WatchedStockPublic) =>
          axios.get(`https://finnhub.io/api/v1/quote?symbol=${item.ticker}&token=${process.env.REACT_APP_FINNHUB_API_KEY}`)
          .then(function(response) {
            return response.data;
          })
      );

      const responses: any = await Promise.all(requests);
      setQuotes(responses);
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
      <div className='watchlist'>
        {isLoading ? "Fetching watchlist.py" : (
          <table>
            <thead>
              <tr>
                <th>SYMBOL</th>
                <th>LATEST PRICE</th>
                <th>CHANGE (%)</th>
              </tr>
            </thead>

            <tbody>
              {quotes && watchlist?.map((watchlistItem: WatchedStockPublic, index: number) => (
                <tr key={index} onClick={() => navigate(`/stock/${watchlistItem.id}`)} className='watchlist-row'>
                   <td>{watchlistItem.ticker}</td>
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