import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import httpClient from '../../httpClient';
import './style.css';

const StockBuy = () => {

    const [orderType, setOrderType] = useState("selectOrderType");
    const [marketOrderContentVisible, setMarketOrderContentVisible] = useState(false);
    const [limitOrderContentVisible, setLimitOrderContentVisible] = useState(false);

    let { ticker } = useParams();

    const [order, setOrder] = useState({
        ticker: "AMZN",
        price: "",
        quantity: ""
    });

    useEffect(() => {
        orderType === "limitOrder" ? setLimitOrderContentVisible(true) : setLimitOrderContentVisible(false);
        orderType === "marketOrder" ? setMarketOrderContentVisible(true) : setMarketOrderContentVisible(false);
    }, [orderType])

    const handleChange = (e) => {
        setOrderType(e.target.value);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(setMarketOrderContentVisible){
            setOrder(previousState => ({
                ...previousState,
                price: "128"
            }))
        }

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

    const limitOrderForm = () => {
        return (
        <form className="buyForm" onSubmit={handleSubmit}>
            <label>STOCK
                <input
                    type="text"
                    defaultValue={ticker}
                    onChange={(e) => setOrder(previousState => {
                        return { ...previousState, ticker: e.target.value}
                    })}
                />
            </label>
            <label>LIMIT PRICE
                <input
                    type="text"
                    onChange={(e) => setOrder(previousState => {
                        return { ...previousState, price: e.target.value}
                    })}
                />
            </label>
            <label>QUANTITY
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

    const marketOrderForm = () => {
        return (
        <form className="buyForm" onSubmit={handleSubmit}>
            <label>STOCK
                <input
                    type="text"
                    defaultValue={ticker}
                    onChange={(e) => setOrder(previousState => {
                        return { ...previousState, ticker: e.target.value}
                    })}
                />
            </label>
            <label>QUANTITY
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

    return (
        <div>
            <select className="order-type-select" value={orderType} onChange={handleChange}>
                <option value="selectOrderType">Select order type</option>
                <option value="marketOrder">Market Order</option>
                <option value="limitOrder">Limit Order</option>
            </select>
            {limitOrderContentVisible && limitOrderForm()}
            {marketOrderContentVisible && marketOrderForm()}
        </div>
    )
}

export default StockBuy;