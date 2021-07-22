# StableCoins

Potential Enchancements:

- maintain a list of holders
- ability for admin to swap oracles
- research and rethink price stabilization mechanism. The adjustSupply() does not seem sufficient. What's the incentive?
- liquidation
  - penalize LP in some way (ex. portion of collateral)
  - paid liquidators a small fee out of the collateral (liquidatePosition)
    - https://medium.com/@natanbaredes/makerdao-cdps-liquidation-analysis-28ee462cf43e
