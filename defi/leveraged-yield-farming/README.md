# Leveraged Yield Farming

## Strategy

This strategy involves combining a flashloans and a collateralized loan to increase the yield on an investor's digit assets comparing to simply just lending their assets.

## Architecture:

3 Smart Contracts:

1. YieldFarmer:
   - main contract that investors will interact with
   - a. "open" position to deposit assets and start yield farming
   - b. "close" position to withdraw assets plus rewards and stop yield farming
2. dYdX:
   - utility contract to interact with the dYdX protocol
   - flashloan provider
3. Compound:
   - utility contract to interact with the Compound protocol
   - yield provider (interest and COMP rewards)
   - loan provider

## Example Workflows:

#### Open position

1. Investor: deposits 30 DAI into YieldFarmer contract
2. YieldFarmer: borrows 70 DAI from dYdX
3. YieldFarmer: lends 100 DAI to Compound
4. YieldFarmer: borrows 70 DAI from Compound
5. YieldFarmer: reimburse 70 DAI to dYdX

...few weeks later...

#### Close position

1. Investor: initiates close position in the YieldFarmer contract
2. YieldFarmer: borrows 75 DAI from dYdX
3. YieldFarmer: reimburse 75 DAI (70 + 5 for interest) to Compound to close loan
4. YieldFarmer: redeem 110 DAI (100 + 10 for interest) and COMP tokens from Compound
5. YieldFarmer: reimburse 75 DAI to dYdX
6. Investor: received 35 DAI (30 + 5 profit) + COMP
