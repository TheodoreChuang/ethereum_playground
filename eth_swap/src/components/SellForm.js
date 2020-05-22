import React, { useState } from 'react'
import tokenLogo from '../token-logo.png'
import ethLogo from '../eth-logo.png'

const SellForm = ({ ethBalance, tokenBalance, ethToTokenRate, sellTokens }) => {
  const [input, setInput] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    const tokenAmount = window.web3.utils.toWei(input, 'Ether')
    sellTokens(tokenAmount)
  }

  return (
    <form className="mb-3" onSubmit={handleSubmit}>
      <div>
        <label className="float-left">
          <b>Input</b>
        </label>
        <span className="float-right text-muted">Balance: {window.web3.utils.fromWei(tokenBalance, 'Ether')}</span>
      </div>
      <div className="input-group mb-4">
        <input
          type="text"
          value={input}
          onChange={(event) => {
            setInput(event.target.value)
          }}
          className="form-control form-control-lg"
          placeholder="0"
          required
        />
        <div className="input-group-append">
          <div className="input-group-text">
            <img src={tokenLogo} height="32" alt="" />
            DApp
          </div>
        </div>
      </div>
      <div>
        <label className="float-left">
          <b>Output</b>
        </label>
        <span className="float-right text-muted">Balance: {window.web3.utils.fromWei(ethBalance, 'Ether')}</span>
      </div>
      <div className="input-group mb-2">
        <input
          type="text"
          className="form-control form-control-lg"
          value={parseFloat(input || 0) / ethToTokenRate}
          disabled
        />
        <div className="input-group-append">
          <div className="input-group-text">
            <img src={ethLogo} height="32" alt="" />
            ETH
          </div>
        </div>
      </div>
      <div className="mb-5">
        <span className="float-left text-muted">Exchange Rate</span>
        <span className="float-right text-muted">100 DApp = 1 ETH</span>
      </div>
      <button type="submit" className="btn btn-primary btn-block btn-lg">
        SWAP!
      </button>
    </form>
  )
}

export default SellForm
