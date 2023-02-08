import React, { useEffect } from 'react';

import httpClient from "../../httpClient";
import Navbar from "../../common/navbar/index";
import Transactions from "../../components/portfolio/transactions";
import PortfolioChart from "../../components/portfolio/portfolioChart";
import "./style.css";

const Portfolio = () => {

  const fetchUser = async () => {
    await httpClient.get("http://localhost:5000/@me")
    .then(function(response){
      console.log(response.data);
    })
    .catch(function(error){
      console.log('Error', error.message);
    })
  }

  useEffect(() => {
    fetchUser();
  }, [])

  return (
    <>
      <Navbar />
      <div className="portfolio-grid-container">
        <div className="portfolioDetails"></div>
        <div className="portfolioChart"><PortfolioChart /></div>
        <div className="portfolioTransactions"><Transactions /></div>
      </div>

    </>
  )
}

export default Portfolio; 