import React from 'react';

import Navbar from "../../common/navbar/index";
import Transactions from "../../components/portfolio/transactions";
import PortfolioChart from "../../components/portfolio/portfolioChart";
import PortfolioHeader from "../../components/portfolio/portfolioHeader";
import PortfolioPositions from "../../components/portfolio/portfolioPositions";
import "./style.css";

const Portfolio = () => {

  return (
    <>
      <Navbar />
      <div className="portfolio-grid-container">
        <div className="portfolioHeader"><PortfolioHeader /></div>
        <div className="portfolioChart"><PortfolioChart /></div>
        <div className="portfolioTransactions"><Transactions /></div>
        <div className="portfolioPositions"><PortfolioPositions /></div>
      </div>

    </>
  )
}

export default Portfolio; 