import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import httpClient from '../../httpClient'

const StockHeader= () => {
  const { ticker }  = useParams();
  const [stock, setStock] = useState({});

  const fetchStock = async (ticker) => {
    await httpClient.get(`http://localhost:5000/stock/${ticker}`)
      .then(function(response){
        setStock(response.data)
      })
      .catch(function(error){
        if(error.response){
          console.log(error.response.data)
        }
      });
  }

  useEffect(() => {
    fetchStock(ticker);
  }, [ticker])

  return (
    <div className="headerContainer">
      <h4>{stock.name} ({stock.ticker})</h4>
      <p>{stock.market}</p>
      <h2>137.48</h2>
    </div>
  )
}

export default StockHeader; 