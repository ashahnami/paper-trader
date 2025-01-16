import React, { useEffect, useState, useRef } from "react";
import { fetchAllStocks } from '../../api/stockApi'
import { useNavigate } from "react-router-dom";
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

import "../../assets/search.css";
import { useQuery } from "@tanstack/react-query";

interface StockSymbol {
    "id": number,
    "symbol": string,
    "description": string,
}

const SearchBar = () => {
  const navigate = useNavigate()
  const [input, setInput] = useState<string>("")
  const [results, setResults] = useState<any[]>()
  const [showResults, setShowResults] = useState<boolean>(true)

  let searchRef = useRef<HTMLInputElement>(null);

  const { data: allStocks } = useQuery({
    queryKey: ['allStocks'],
    queryFn: () => fetchAllStocks(),
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShowResults(true)
    setInput(e.target.value)

    if(allStocks && e.target.value.length > 0 && allStocks.length > 0){
      const result = allStocks.filter((stock: StockSymbol) => {
        return stock.symbol.startsWith(e.target.value.toUpperCase()) || stock.description.startsWith(e.target.value.toUpperCase()); 
      })
      setResults(result)
    } else {
      setResults([])
    }
  }

  const clearInput = () => {
    setInput("");
    setResults([]);
  }

  useEffect(() => {
    const handler = (event: any) => {
      if(!searchRef?.current?.contains(event.target)){
        setShowResults(false);
      }
    }

    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    }
  }, [])

  return (
    <div className="search" ref={searchRef}>
      <div className="input-container">
        <input 
          type="text" 
          value={input}
          onChange={handleChange} 
          onFocus={() => setShowResults(true)}
          placeholder="Search" 
        />
        
        <div className="search-icon">
          {input.length > 0 ? <ClearIcon onClick={clearInput} style={{color:"999999"}}/> : <SearchIcon style={{color:"999999"}}/>}
        </div>
      </div>

      <div className="results">
        {showResults ? results?.slice(0, 5).map((stock, i) => {
          return (
            <div 
              className="result"
              key={i}
              onClick={(e) => {
                clearInput()
                navigate(`/stock/${stock.symbol}`, { state: { id: stock.id }})
              }}
              >
                <h4 style={{"fontWeight": "bold"}}>{stock.symbol}</h4>
                <h6>{stock.description}</h6>
              </div>
          );
        }) : null}
      </div>
    </div>
  );
}

export default SearchBar;