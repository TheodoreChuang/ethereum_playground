# StableCoins

Why do they have any value? Most are backed with assets.
Stable compare to what? Some peg.
How is the peg maintained? Large buy and sell walls around the target price. Collateral ratios need to be maintained.

The Tokens
The Reserve Protocol interacts with three kinds of tokens:

The Reserve token (RSV) — a stable cryptocurrency that can be held and spent the way we use US dollars and other stable fiat money.
The Reserve Rights token (RSR) — a cryptocurrency used to facilitate the stability of the Reserve token.
Collateral tokens — other assets that are held by the Reserve smart contract in order to back the value of the Reserve token, similar to when the US government used to back the US dollar with gold. The protocol is designed to hold collateral tokens worth at least 100% of the value of all Reserve tokens. Many of the collateral tokens will be tokenized real-world assets such as tokenized bonds, property, and commodities. The portfolio will start off relatively simple and diversify over time as more asset classes are tokenized.
How the Reserve Token is Stabilized
If demand goes down for the Reserve token, prices are expected to fall on secondary markets. What happens then?

Suppose the redemption price of Reserve is $1.00. If the price of Reserve on the open market is $0.98, arbitrageurs will be incentivized to buy it up and redeem it with the Reserve smart contract for $1.00 worth of collateral tokens. They'll continue buying on open markets until there is no more money to be made, which is when the market price matches the redemption price of $1.00.

The same mechanism works in reverse when demand goes up. If the price of Reserve on the open market is $1.02, arbitrageurs will be incentivized to purchase newly minted Reserve tokens for $1.00 worth of either collateral or Reserve Rights tokens (the latter only if there is an excess pool of Reserve tokens available), and immediately sell them on the open market. They'll continue selling on open markets until there is no more money to be made, which is when the market price matches the purchase price of $1.00.

How the Reserve Protocol is Capitalized
The Reserve Protocol holds the collateral tokens that back the Reserve token. When new Reserves are sold on the market, the assets used by market participants to purchase the new Reserves are held as collateral. This process keeps the Reserve collateralized at a 1:1 ratio even as supply increases.

At times, the Reserve Protocol may target a collateralization ratio greater than 1:1. When this is the case, scaling the supply of Reserve tokens requires additional capital in order to maintain the target collateralization ratio. To accomplish this the Reserve Protocol mints and sells Reserve Rights tokens in exchange for additional collateral tokens.

What Happens When the Collateral Tokens Depreciate
Collateral tokens are somewhat volatile. While we may be able to select a portfolio with minimal downside risk, the reality is that drops in the collateral tokens' value will happen. When this happens, the Reserve Protocol will sell newly minted Reserve Rights tokens for additional collateral tokens and add them to the backing.

https://assets.website-files.com/5c0649fb67dd7b3627d59953/5ce4648a881a4d44305dd016_Protocol-Diagram-1.png

https://reserve.org/protocol
