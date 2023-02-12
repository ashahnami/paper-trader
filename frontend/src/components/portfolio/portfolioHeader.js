import React from 'react'
import { useGetCurrentUserQuery } from '../../api/userApi'
import './style.css'

const PortfolioHeader = () => {

    const { data } = useGetCurrentUserQuery()

  return (
    <div className="portfolioHeaderContainer">
        <h3>Welcome {data.username}!</h3>
        <h4>Balance: {data.balance.toFixed(2)}</h4>
    </div>
  )
}

export default PortfolioHeader