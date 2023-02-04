import React from 'react';
import { useParams } from 'react-router-dom';

const StockHeader= () => {
  const { ticker }  = useParams();
  return (
    <div className="headerContainer">
      <h4>{ticker}</h4>
      <h2>137.48</h2>
    </div>
  )
}

export default StockHeader; 