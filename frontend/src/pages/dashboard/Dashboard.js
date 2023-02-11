import React from 'react';

import Navbar from "../../common/navbar/index";
import Transactions from "../../components/portfolio/transactions";
import PortfolioChart from "../../components/portfolio/portfolioChart";
import "./style.css";
import { useGetCurrentUserQuery } from '../../api/userApi';

const Portfolio = () => {

  useGetCurrentUserQuery();
  
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