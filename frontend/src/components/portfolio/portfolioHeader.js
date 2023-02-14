import React from 'react'
import { useGetCurrentUserQuery } from '../../api/userApi'
import './style.css'

const PortfolioHeader = () => {

    const { data: user, isLoading } = useGetCurrentUserQuery()

    if(isLoading) return <div>Loading...</div>

  return (
    <div className="portfolioHeaderContainer">
        <h3>Welcome {user.username}!</h3>
        <h4>Balance: {user.balance.toFixed(2)}</h4>
    </div>
  )
}

export default PortfolioHeader