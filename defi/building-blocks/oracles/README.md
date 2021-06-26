# Oracle

Incorporating external information within Ethereum.

This project is an example of a pull based oracle. See /docs for example flow.

(1) Set up Ethereum network

```bash
$ truffle develop
$ truffle(develop)> migrate --reset
```

(2) Run truffle script to saw push external price data

```bash
$ truffle exec scripts/price-watcher.js --network developement
```

(3) Pull price data from oracle contract to confirm information is flowing through

```bash
$ truffle(develop)> let oracle = await Oracle.deployed()
$ truffle(develop)> oracle.getData('0xee62665949c883f9e0f6f002eac32e00bd59dfe6c34e92a91c37d6a8322d6489')
```
