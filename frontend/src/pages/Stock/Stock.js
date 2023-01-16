import React from 'react';
import { useParams } from 'react-router-dom';

import StockChart from '../../components/chart/index.js';
import StockDetails from '../../components/stock/index.js';

const Stock = () => {

    const routeParams = useParams();

    return (
        <>
            <p>
                Ticker: {routeParams.ticker}
            </p>
            <StockChart ticker={routeParams.ticker} />
            <StockDetails ticker={routeParams.ticker} />
        </>
    )
}

export default Stock;