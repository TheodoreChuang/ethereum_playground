import React, { useState, useEffect } from 'react'
import web3 from './web3'
import lottery from './LotteryContract'

function App() {
  const [lotteryState, setLotteryState] = useState({ manager: '', players: [], lotteryBalance: '' })
  const [enterValue, setEnterValue] = useState('')
  const [message, setMessage] = useState('')

  const loadBlockchainData = async () => {
    const manager = await lottery.methods.manager().call()
    const players = await lottery.methods.getPlayers().call()
    const lotteryBalance = await web3.eth.getBalance(lottery.options.address)
    setLotteryState({ manager, players, lotteryBalance })
  }

  useEffect(() => {
    loadBlockchainData()
  }, [])

  const handleEnterLottery = async (evt) => {
    evt.preventDefault()
    const accounts = await web3.eth.getAccounts()

    setMessage('Processing your transaction...')
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(enterValue, 'ether'),
    })
    setEnterValue('')
    setMessage('You have been entered into the lottery. Good Luck!')
    loadBlockchainData()
  }

  const handlePickWinner = async () => {
    const accounts = await web3.eth.getAccounts()

    setMessage('Processing your transaction...')
    await lottery.methods.pickWinner().send({ from: accounts[0] })
    setMessage('A winner has been picked.')
    loadBlockchainData()
  }

  return (
    <div className="App">
      <h1>Lottery Contract</h1>
      <div>This contract is managed by: {lotteryState.manager}</div>
      <div>There are currently {lotteryState.players.length} players in the pool.</div>
      <div>Current pot is: {web3.utils.fromWei(lotteryState.lotteryBalance, 'ether')} ETH</div>

      <hr />
      <form onSubmit={handleEnterLottery}>
        <h4>Want to try your luck?</h4>
        <div>
          <label>Amount to ETH to enter </label>
          <input value={enterValue} onChange={(evt) => setEnterValue(evt.target.value)} />
          <button>Enter</button>
        </div>
      </form>

      <hr />
      <h4>Ready to pick a winner?</h4>
      <button onClick={handlePickWinner}>Pick a winner</button>

      <hr />
      <div>{message}</div>
    </div>
  )
}

export default App
