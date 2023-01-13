import React from 'react';
import { useParams } from 'react-router-dom';
import StockChart from '../../components/Chart/stockChart.js';

const Stock = () => {

    const routeParams = useParams();

    return (
        <>
            <p>
                Ticker: {routeParams.ticker}
            </p>
            <StockChart ticker={routeParams.ticker}/>
        </>
    )
}

export default Stock;