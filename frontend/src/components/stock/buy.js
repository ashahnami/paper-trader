import React, { useState } from 'react';
import axios from 'axios';
import httpClient from '../../httpClient';
import './style.css';

const StockBuy = (props) => {

    const [order, setOrder] = useState({
        ticker: "MSFT",
        price: "",
        quantity: ""
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        await httpClient.post('http://localhost:5000/buy', {
            ticker: order.ticker,
            price: order.price,
            quantity: order.quantity 
        })
        .then(function(response){
            console.log(response);
        })
        .catch(function(error){
            console.log(error);
        })
    }

    return (
        <form onSubmit={handleSubmit}>

            <label>
                STOCK:
                <input
                    type="text"
                    onChange={(e) => setOrder(previousState => {
                        return { ...previousState, ticker: e.target.value}
                    })}
                />
            </label>

            <label>
                LIMIT PRICE:
                <input
                    type="text"
                    onChange={(e) => setOrder(previousState => {
                        return { ...previousState, price: e.target.value}
                    })}
                />
            </label>

            <label>
                QUANTITY:
                <input
                    type="text"
                    onChange={(e) => setOrder(previousState => {
                        return { ...previousState, quantity: e.target.value}
                    })}
                />
            </label>

            <input type="submit" value="Submit Order" />

        </form>
    )
}

export default StockBuy;