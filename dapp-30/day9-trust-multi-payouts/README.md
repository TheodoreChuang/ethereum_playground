# Trust Multi Payout

Trustor deploys the Trust contract with pre-determined parameters.

- asset / value (ETH)
- time-lock duration (seconds)
- number of payouts
- duration between payouts (seconds)
- Trustee
- Beneficiary

The trustee can withdraw and transfer the contract asset to the beneficiary after the pre-determined time has past. Withdrawals can be split between multiple payouts with an equal amount of delay between each. On withdrawal if there are multiple outstanding payouts, they will all be withdrawed at once bring the payouts up to date.

[contract deployed]...time-lock...[withdraw n]...interval...[withdraw n+1]...interval...etc...
