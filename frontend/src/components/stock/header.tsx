import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchStock } from '../../api/stockApi';

const StockHeader= () => {
  const { ticker }  = useParams();

  const { data: stock, isLoading } = useQuery({
    queryKey: ['stock'],
    queryFn: () => fetchStock(ticker ? ticker : ""),
  })

  useEffect(() => {
  }, [ticker])

  if (isLoading) {
    return <span>Loading...</span>
  }

  return (
    <div className="headerContainer">
      <h4>{stock?.name} ({stock?.ticker})</h4>
      <p>{stock?.market}</p>
      <h2>137.48</h2>
    </div>
  )
}

export default StockHeader; 