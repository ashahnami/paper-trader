import React from 'react';
import { useParams } from 'react-router-dom';
import './style.css';
import { useGetStockDetailsQuery } from '../../api/stockApi';

const StockDetails = () => {

    const { ticker }  = useParams();
    const { data, isFetching } = useGetStockDetailsQuery(ticker);

    if(isFetching) return <div>Loading...</div>
    const stockDetails = data["Global Quote"]

    return (
        <div className="details-grid">

            <div className="open">
                <h4>Open</h4>
                <h3>{parseFloat(stockDetails["02. open"]).toFixed(2)}</h3>
            </div>
            <div className="high">
                <h4>High</h4>
                <h3>{parseFloat(stockDetails["03. high"]).toFixed(2)}</h3>
            </div>
            <div className="low">
                <h4>Low</h4> 
                <h3>{parseFloat(stockDetails["04. low"]).toFixed(2)}</h3>
            </div>
            <div className="volume">
                <h4>Volume</h4>
                <h3>{parseInt(stockDetails["06. volume"]).toLocaleString()}</h3>
            </div>
            <div className="previousclose">
                <h4>Previous close</h4>
                <h3>{parseFloat(stockDetails["08. previous close"]).toFixed(2)}</h3>
            </div>
            <div className="changepercent">
                <h4>Change percent</h4>
                <h3>{parseFloat(stockDetails["10. change percent"]).toFixed(2)}%</h3>
            </div>
        </div>
    )
}

export default StockDetails;