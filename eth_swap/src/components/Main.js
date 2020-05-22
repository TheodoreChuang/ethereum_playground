import React, { useState } from 'react'
import BuyForm from './BuyForm'
import SellForm from './SellForm'

const Main = ({ ethBalance, tokenBalance, ethToTokenRate, buyTokens, sellTokens }) => {
  const [currentForm, setCurrentForm] = useState('buy')
  let content
  if (currentForm === 'buy') {
    content = (
      <BuyForm
        ethBalance={ethBalance}
        tokenBalance={tokenBalance}
        ethToTokenRate={ethToTokenRate}
        buyTokens={buyTokens}
      />
    )
  } else {
    content = (
      <SellForm
        ethBalance={ethBalance}
        tokenBalance={tokenBalance}
        ethToTokenRate={ethToTokenRate}
        sellTokens={sellTokens}
      />
    )
  }

  return (
    <div id="content mt-3">
      <div className="d-flex justify-content-between mb-3">
        <button
          className="btn btn-light"
          onClick={() => {
            setCurrentForm('buy')
          }}
        >
          Buy
        </button>
        <span className="text-muted">&lt; &nbsp; &gt;</span>
        <button
          className="btn btn-light"
          onClick={() => {
            setCurrentForm('sell')
          }}
        >
          Sell
        </button>
      </div>
      <div className="card mb-4">
        <div className="card-body">{content}</div>
      </div>
    </div>
  )
}

export default Main
