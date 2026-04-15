import { useQuery } from '@tanstack/react-query'
import { fetchWatchlist } from '../../api/userApi'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { WatchedStockPublic } from "../../entities/types";
import { getStocksQuotes} from "@/api/stockApi";

const Watchlist = () => {
    const { data: watchlist, isFetched: watchlistFetched } = useQuery({
      queryKey: ['watchlist'],
      queryFn: () => fetchWatchlist(),
      initialData: []
    })

    const { data: quotes, isFetched: quotesFetched, refetch } = useQuery({
        queryKey: ['watchlist_quotes'],
        queryFn: () => getStocksQuotes(watchlist.map((item: WatchedStockPublic)=> item.id)),
        enabled: false,
    })

    const navigate = useNavigate();

    useEffect(() => {
      if (watchlistFetched) {
          refetch().then(r => console.log("REFETCHED QUOTES"))
      }
    }, [watchlistFetched])

    if (!watchlistFetched) {
      return <span>Loading...</span>
    }

    return (
      <div className='watchlist'>
        {!watchlistFetched ? "Fetching watchlist.py" : (
          <table>
            <thead>
              <tr>
                <th>SYMBOL</th>
                <th>LATEST PRICE</th>
                <th>CHANGE (%)</th>
              </tr>
            </thead>

            <tbody>
              {quotes && watchlist.map((watchlistItem: WatchedStockPublic, index: number) => (
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