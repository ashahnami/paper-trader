import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { fetchTransactions } from '../../api/userApi.js';
import './style.css';

const Transactions = () => {
    const { data: transactions, isLoading } = useQuery({
        queryKey: ['transactions'],
        queryFn: () => fetchTransactions('AAPL'),
    })

    const [visible, setVisible] = useState(3);

    const showMoreTransactions = () => {
        setVisible((prevState) => prevState+3);
    }

    if (isLoading) {
        return <span>Loading...</span>
    }

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
            {transactions?.slice(0, visible).map((transaction, index) => (
                <tr key={index}>
                    <td>{transaction.symbol}</td>
                    <td>{transaction.name}</td>
                    <td>{transaction.price}</td>
                    <td>{transaction.shares}</td>
                </tr>
            ))}
            </tbody>
        </table>
        {transactions?.length && visible < transactions.length ? 
            <button onClick={showMoreTransactions} className="showMoreTransactions">Load more</button>
         : null}
    </>

  )
}

export default Transactions