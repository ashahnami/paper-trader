import React, { useState, useEffect } from 'react';

import httpClient from '../../httpClient.js';
import './style.css';

const Transactions = () => {

    const [transactions, setTransactions] = useState([{}]);
    const [visible, setVisible] = useState(3);

    const showMoreTransactions = () => {
        setVisible((prevState) => prevState+3);
    }

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
    <>
        <table className="transactionsTable">
            <thead>
                <tr>
                    <th>Ticker</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Shares</th>
                </tr>
            </thead>
            <tbody>
            {transactions.slice(0, visible).map((transaction, index) => (
                <tr key={index}>
                    <td>{transaction.stockSymbol}</td>
                    <td>{transaction.stockName}</td>
                    <td>{transaction.price}</td>
                    <td>{transaction.shares}</td>
                </tr>
            ))}
            </tbody>
        </table>
        {visible < transactions.length ? 
            <button onClick={showMoreTransactions} className="showMoreTransactions">Load more</button>
         : null}
    </>

  )
}

export default Transactions