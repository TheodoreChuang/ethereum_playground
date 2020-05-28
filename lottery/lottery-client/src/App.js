import React, { useState, useEffect } from 'react'
import web3 from './web3'
import lottery from './LotteryContract'

function App() {
  const [manager, setManager] = useState('')

  const loadBlockchainData = async () => {
    const manager = await lottery.methods.manager().call()
    setManager(manager)
  }

  useEffect(() => {
    loadBlockchainData()
  }, [])

  web3.eth.getAccounts().then(console.log)

  return <div className="App">Lottery. Managed by: {manager}</div>
}

export default App
