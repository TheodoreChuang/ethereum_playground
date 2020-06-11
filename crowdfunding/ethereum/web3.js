// // require('dotenv').config()
import Web3 from 'web3';

let web3;

if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
  // in browser and MetaMask running
  web3 = new Web3(window.web3.currentProvider);
} else {
  // on server or use not running MetaMask
  const provider = new Web3.providers.HttpProvider('https://rinkeby.infura.io/v3/d60aea4172c948168e29647a48f311fd');
  web3 = new Web3(provider);
}

export default web3;

// import Web3 from 'web3'

// let web3

// if (typeof window !== 'undefined' && (typeof window.ethereum !== 'undefined' || typeof window.web3 !== 'undefined')) {
//   // We are in the browser and MetaMask is running.
//   if (typeof window.ethereum !== 'undefined') {
//     // Ethereum user detected. Let's use the injected provider.
//     web3 = new Web3(window.ethereum)

//     if (typeof window.ethereum.autoRefreshOnNetworkChange !== 'undefined') {
//       window.ethereum.autoRefreshOnNetworkChange = false
//     }

//     window.ethereum.on('chainChanged', () => {
//       document.location.reload()
//     })

//     // Request approval from the user to use an ethereum address they can be identified by.
//     window.ethereum
//       .enable()
//       .then((_accounts) => {
//         // no need to do anything here
//       })
//       .catch(function (error) {
//         // Handle error. Likely the user rejected the login.
//         console.error(error)
//         alert('Sorry, this application requires user approval to function correctly.')
//       })
//   } else {
//     web3 = new Web3(window.web3.currentProvider)
//   }
// } else {
//   // We are on the server OR MetaMask is not running.
//   const provider = new Web3.providers.HttpProvider('https://rinkeby.infura.io/v3/d60aea4172c948168e29647a48f311fd')

//   web3 = new Web3(provider)
// }

// export default web3
