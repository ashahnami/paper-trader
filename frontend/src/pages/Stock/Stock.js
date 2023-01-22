import React from 'react';
import { useParams } from 'react-router-dom';

import StockChart from '../../components/chart/index.js';
import StockDetails from '../../components/stock/details.js';
import StockBuy from '../../components/stock/buy.js';
import StockHeader from '../../components/stock/header.js';

import './style.css';

const Stock = () => {

    const routeParams = useParams();
    const ticker = routeParams.ticker;

    return (
        <div className="grid-container">
            <div className="grid-item stock-header"><StockHeader /></div>
            <div className="grid-item stock-chart"><StockChart ticker={ticker} /></div>
            <div className="grid-item stock-details"><StockDetails ticker={ticker} /></div>
            <div className="grid-item stock-buy"><StockBuy ticker={ticker} /></div>
        </div>
    )
}

export default Stock;