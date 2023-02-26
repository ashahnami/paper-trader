import React, { useState, useEffect } from 'react'
import axios from 'axios'

let shares = [], averagePrices = []
let changes = []

const PortfolioPositions = () => {

    const [positions, setPositions] = useState([])
    const [currValues, setCurrValues] = useState([])
    
    const getLatestPrice = async (ticker, i) => {
        let latestPrice

        await fetch(`https://finnhub.io/api/v1/quote?symbol=${ticker}&token=${process.env.REACT_APP_FINNHUB_API_KEY}`)
            .then(res => res.json())
            .then(result => {
                latestPrice = result.c
                // currValues[parseInt(i)] = Number(shares[i] * result.c).toFixed(2)
                setCurrValues([
                        ...currValues,
                        {val: (shares[i] * latestPrice).toFixed(2)}
                    ])
            })
            .then(() => {
                changes[i] = ((averagePrices[i] - latestPrice) / latestPrice * 100).toFixed(2)
            })
    }
    
    const getPositions = async () => {
        await axios.get('http://localhost:5000/positions',
        { withCredentials: true})
        .then(function(response){
            response.data.forEach((position, i) => {
                setPositions([
                    ...positions,
                    {symbol: position.stockSymbol, shares: position.shares, averagePrice: position.averagePrice}
                ])
                getLatestPrice(positions[i]["symbol"], i)
                console.log(currValues[i])
            })
        })
        .catch(function(error){
            console.log(error)
        })
    }

    useEffect(() => {
        getPositions()
    }, [])

  return (
    <div>
        <table>
            <thead>
                <tr>
                    <th>SYMBOL</th>       
                    <th>QUANTITY</th>
                    <th>CHANGE</th>
                    <th>CURRENT VALUE</th>
                </tr>
            </thead>
            <tbody>
                {positions.map((position, i) => (
                    <tr key={i}>
                        <td>{position.symbol}</td>
                        <td>{position.shares}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
  )
}

export default PortfolioPositions