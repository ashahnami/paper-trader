import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './style.css';

const StockDetails = (props) => {

    const [details, setDetails] = useState({});
    const ticker = props.ticker;
    const URL = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${ticker}&apikey=${process.env.API_KEY}`;

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
        <div className="details-grid">
            <div className="open">
                <h4>Open</h4>
                <h3>{parseFloat(details["02. open"]).toFixed(2)}</h3>
            </div>
            <div className="high">
                <h4>High</h4>
                <h3>{parseFloat(details["03. high"]).toFixed(2)}</h3>
            </div>
            <div className="low">
                <h4>Low</h4> 
                <h3>{parseFloat(details["04. low"]).toFixed(2)}</h3>
            </div>
            <div className="volume">
                <h4>Volume</h4>
                <h3>{parseInt(details["06. volume"]).toLocaleString()}</h3>
            </div>
            <div className="previousclose">
                <h4>Previous close</h4>
                <h3>{parseFloat(details["08. previous close"]).toFixed(2)}</h3>
            </div>
            <div className="changepercent">
                <h4>Change percent</h4>
                <h3>{parseFloat(details["10. change percent"]).toFixed(2)}%</h3>
            </div>
        </div>
    )
}

export default StockDetails;