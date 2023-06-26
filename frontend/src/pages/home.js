import React from 'react';

import Navbar from "../common/navbar/index";
import "../assets/home.css";

const home = () => {
  return (
    <div className="home">
      <Navbar />
      <div className="home-container">
        news + watchlist
      </div>
    </div>
  )
}

export default home
