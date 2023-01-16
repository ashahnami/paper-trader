import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './style.css';

const StockDetails = (ticker) => {

    const [details, setDetails] = useState({});
    const URL = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${ticker.ticker}&apikey=${process.env.API_KEY}`;

    useEffect(() => {

        const fetchData = async () => {
    
            await axios.get(URL)
            .then(function(response){
                setDetails(response.data["Global Quote"]);
            })
            .catch(function(error){
                console.log(error);
            })
        }
        fetchData();

    }, [])

    return (
        <div className="details_container">
            <p>Symbol: {details["01. symbol"]}</p>
            <p>Price: {details["05. price"]}</p>
            <p>Open: {details["02. open"]}</p>
            <p>High: {details["03. high"]}</p>
            <p>Low: {details["04. low"]}</p>
            <p>Volume: {details["06. volume"]}</p>
            <p>Previous close: {details["08. previous close"]}</p>
            <p>Change percent: {details["10. change percent"]}</p>
        </div>
    )
}

export default StockDetails;