import React from 'react';
import { useParams } from 'react-router-dom';

import StockChart from '../../components/chart/index.js';
import StockDetails from '../../components/stock/details.js';

const Stock = () => {

    const routeParams = useParams();
    const ticker = routeParams.ticker;

    return (
        <>
            <p>
                Ticker: {ticker}
            </p>
            <StockChart ticker={ticker} />
            <StockDetails ticker={ticker} />
        </>
    )
}

export default Stock;