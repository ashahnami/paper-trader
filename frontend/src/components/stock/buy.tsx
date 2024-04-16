import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import httpClient from '../../httpClient';
import './style.css';

interface Order {
    'ticker': string;
    'price': number;
    'quantity': number;
}

const StockBuy = () => {
    const [orderType, setOrderType] = useState<string>("selectOrderType");
    const [marketOrderContentVisible, setMarketOrderContentVisible] = useState<boolean>(false);
    const [limitOrderContentVisible, setLimitOrderContentVisible] = useState<boolean>(false);

    let { ticker } = useParams();

    const [order, setOrder] = useState<Order>();

    useEffect(() => {
        orderType === "limitOrder" ? setLimitOrderContentVisible(true) : setLimitOrderContentVisible(false);
        orderType === "marketOrder" ? setMarketOrderContentVisible(true) : setMarketOrderContentVisible(false);
    }, [orderType])

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setOrderType(e.target.value);
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if(marketOrderContentVisible){
            setOrder((previousState: any) => ({
                ...previousState,
                price: 128
            }))
        }

        await httpClient.post('/buy', {
            ticker: order?.ticker,
            price: order?.price,
            quantity: order?.quantity 
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
                    onChange={(e) => setOrder((previousState: any) => {
                        return { ...previousState, ticker: e.target.value}
                    })}
                />
            </label>
            <label>LIMIT PRICE
                <input
                    type="number"
                    onChange={(e) => setOrder((previousState: any) => {
                        return { ...previousState, price: e.target.value}
                    })}
                />
            </label>
            <label>QUANTITY
                <input
                    type="number"
                    onChange={(e) => setOrder((previousState: any) => {
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
                    onChange={(e) => setOrder((previousState: any) => {
                        return { ...previousState, ticker: e.target.value}
                    })}
                />
            </label>
            <label>QUANTITY
                <input
                    type="text"
                    onChange={(e) => setOrder((previousState: any) => {
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