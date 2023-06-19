import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CloseIcon from '@mui/icons-material/Close';
import Navbar from "../common/navbar/index";
import { useGetPositionsQuery } from '../api/userApi';
import httpClient from '../httpClient';
import "../assets/portfolio.css";

const Portfolio = () => {
  const { data: positions, isFetching, refetch } = useGetPositionsQuery();
  const [changes, setChanges] = useState([]);
  const [currValues, setCurrValues] = useState([]);
  const [isFinished, setIsFinished] = useState(false);
  const [balance, setBalance] = useState(0);
  const [netBalance, setNetBalance] = useState(0);

  const fetchBalance = async () => {
    try {
      const response = await httpClient.get("http://localhost:5000/balance");
      setBalance(response.data.balance.toFixed(2));
    } catch (error) {
      console.error(error);
    }
  };

  const updatePrices = async () => {
    try {
      const requests = positions.map(position =>
        axios.get(`https://finnhub.io/api/v1/quote?symbol=${position.stockSymbol}&token=${process.env.REACT_APP_FINNHUB_API_KEY}`)
      );

      const responses = await Promise.all(requests);

      let net = 0;

      const updatedChanges = responses.map((response, index) => {
        const { c: latestPrice } = response.data;
        const change = ((latestPrice - positions[index].averagePrice) / latestPrice * 100).toFixed(2);
        return change;
      });

      const currValueChanges = responses.map((response, index) => {
        const { c: latestPrice } = response.data;
        const currValue = (positions[index].shares * latestPrice).toFixed(2);
        net += parseFloat(currValue);
        return currValue;
      });

      setCurrValues(currValueChanges);
      setChanges(updatedChanges);
      setNetBalance(parseFloat(net.toFixed(2)) + parseFloat(balance));
      setIsFinished(true);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    document.title = "Paper Trading Application";
    fetchBalance();
    if (positions && !isFetching) {
      updatePrices();
    }
  }, [positions, isFetching, balance]);

  const closePosition = async (ticker) => {
    try {
      await httpClient.post(`http://localhost:5000/closeposition/${ticker}`);
      refetch();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="portfolio">
      <Navbar />
      <div className="portfolio-container">
        <div className="portfolio-header">
          <h1>Portfolio</h1>
          <div className="balance">
            <div>
              <h4>Net Liquidity</h4>
              <div className="price">{netBalance}</div>
            </div>
            <div>
              <h4>Excess Liquidity</h4>
              <div className="price">{balance}</div>
            </div>
          </div>
        </div>
        {isFinished ? (
          <table className="portfolio-table">
            <thead>
              <tr className="header-row">
                <th>SYMBOL</th>
                <th>QUANTITY</th>
                <th>CHANGE</th>
                <th>AVG PRICE</th>
                <th>CURRENT VALUE</th>
                <th>UNREALISED P&amp;L</th>
              </tr>
            </thead>
            <tbody>
              {positions.map((position, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: "bold" }}>{position.stockSymbol}</td>
                  <td>{position.shares}</td>
                  <td>{changes[i]}%</td>
                  <td>{position.averagePrice.toFixed(2)}</td>
                  <td>{currValues[i]}</td>
                  <td>{(position.averagePrice * position.shares - currValues[i]).toFixed(2)}</td>
                  <td className="crossIcon" onClick={() => closePosition(position.stockSymbol)}><CloseIcon /></td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : "Loading positions..."}
      </div>
    </div>
  );
};

export default Portfolio;