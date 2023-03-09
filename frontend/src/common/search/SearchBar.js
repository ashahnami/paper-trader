import React, { useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

import "../../assets/search.css";

const SearchBar = () => {
  const [input, setInput] = useState("")
  const [results, setResults] = useState([])
  const [timer, setTimer] = useState(null)
  const navigate = useNavigate()

  const fetchData = (value) => {
    axios.get(`https://finnhub.io/api/v1/search?q=${value}&token=${process.env.REACT_APP_FINNHUB_API_KEY}`)
    .then(function(response){
      const json = response.data.result;
      const r = json.filter((x) => {
        return  (
          !x.displaySymbol.toLowerCase().includes('.')
        )
      })
      setResults(r)
    })
  } 

  const handleChange = (value) => {
    setInput(value)
    clearTimeout(timer)
    const newTimer = setTimeout(() => {
      fetchData(value);
    }, 500)
    setTimer(newTimer)
  }

  return (
    <div className="search">
      <input 
        type="text" 
        onChange={(e) => handleChange(e.target.value)} 
        placeholder="Search" />
      <div className="results">
        {results.slice(0, 5).map((stock, i) => {
          return (
            <div 
              className="result"
              key={i}
              onClick={(e) => {
                navigate(`/stock/${stock.displaySymbol}`)
              }}
              >
                <h4>{stock.displaySymbol}</h4>
                <h6>{stock.description}</h6>
              </div>
          );
        })}
      </div>
    </div>
  );
}

export default SearchBar;