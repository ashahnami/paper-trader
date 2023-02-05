import React, { useState, useEffect } from 'react';

import httpClient from '../../httpClient.js';
import './style.css';

const Transactions = () => {

    const [transactions, setTransactions] = useState([{}]);

    const fetchTransactions = async () => {
        await httpClient.get("http://localhost:5000/transactions")
            .then(function(response){
                setTransactions(response.data);
            })
            .catch(function(error){
                if(error.response){
                    console.log(error.response.data);
                }
        });
    }

    useEffect(() => {
        fetchTransactions();
    }, [])

  return (
    <table className="transactionsTable">
        <thead>
            <tr>
                <th key="label1">Ticker</th>
                <th key="label2">Name</th>
                <th key="label3">Price</th>
                <th key="label4">Shares</th>
            </tr>
        </thead>
        <tbody>
            {transactions.slice(0, 3).map((t, index) => { return (
                <tr key={index}>
                    <td>{t.stockSymbol}</td>
                    <td>{t.stockName}</td>
                    <td>{t.price}</td>
                    <td>{t.shares}</td>
                </tr>
            )})}
        </tbody>
    </table>
  )
}

export default Transactions