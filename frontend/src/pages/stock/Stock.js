import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import httpClient from "../../httpClient";
import Navbar from '../../common/navbar/index';
import StockChart from '../../components/chart/index.js';
import StockDetails from '../../components/stock/details.js';
import StockBuy from '../../components/stock/buy.js';
import StockHeader from '../../components/stock/header.js';

import './style.css';

const Stock = () => {

    const [user, setUser] = useState({});

  const logoutUser = async () => {

    await httpClient.post("http://localhost:5000/logout")
    .then(function(response){
      console.log(response);
      window.location.href="/";
    })
    .catch(function(error){
      if(error.response){
        console.log(error.response.data)
      }
      console.log(error);
    });
  }

  useEffect(() => {
    const fetchData = async () => {
      await httpClient.get("http://localhost:5000/@me")
      .then(function(response){
        setUser(response.data)
      })
      .catch(function(error){
        console.log('Error', error.message)
      })
    }

    fetchData();

  }, [])

    const routeParams = useParams();
    const ticker = routeParams.ticker;

    return (
    <>
        <Navbar currentUser={user} logout={logoutUser} />
        <div className="grid-container">
            <div className="grid-item stock-header"><StockHeader /></div>
            <div className="grid-item stock-chart"><StockChart ticker={ticker} /></div>
            {/* <div className="grid-item stock-details"><StockDetails ticker={ticker} /></div> */}
            <div className="grid-item stock-buy"><StockBuy ticker={ticker} /></div>
        </div>
    </>
    )
}

export default Stock;