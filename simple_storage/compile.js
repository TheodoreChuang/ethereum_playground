const path = require('path')
const fs = require('fs')
const solc = require('solc')

const simpleStoragePath = path.resolve(__dirname, 'contracts', 'SimpleStorage.sol')
const source = fs.readFileSync(simpleStoragePath, 'utf8')

/***
 * The recommended way to interface with the Solidity compiler, especially for more
 * complex and automated setups is the so-called JSON-input-output interface.
 *
 * See https://solidity.readthedocs.io/en/v0.5.15/using-the-compiler.html#compiler-input-and-output-json-description
 * for more details.
 */
const input = {
  language: 'Solidity',
  sources: {
    'SimpleStorage.sol': {
      content: source,
    },
  },
  settings: {
    outputSelection: {
      '*': {
        '*': ['*'],
      },
    },
  },
}

const output = JSON.parse(solc.compile(JSON.stringify(input)))

module.exports = output.contracts['SimpleStorage.sol'].SimpleStorage
