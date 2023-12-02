## Goals

- Who is Santa?
- How to get on the Nice and Extra Nice list?
- How to get on the Naughty list?
- How to get on the Unknown list?

## Notes

- Understand the state machine of `Status`.
  - Can someone go from Naughty to Nice? or vice versa?
  - A: There is no state machine. Target state is an input.
- What happens if someone get checked more than twice?
- Check permissioning.
- Any issues if an address mints a NFT and then receives one? Or vice versa?
- Review solmate, especially review the modifications.
  - See this https://github.com/PatrickAlphaC/solmate-bad/commit/c3877e5571461c61293503f45fc00959fff4ebba#diff-677ee1b0f6d434a9aced18932e55d00e7d05a7ff4a487cc119790d328b5d7a04 for changes.
  - I don't think any changes were made to solmate's ERC721.
- Review the purpose of the Christmas date. What timezone? Any way to cheat this?

## Reviewed

- SantaToken contract seems okay.
  - Mint to and burns from 1e18 tokens.

## Findings

- @audit-issue Medium? [checkList is callable by non-Santa] Does not have 'onlySanta' modifier but should accounting to the docs.
- @audit-issue Medium? [Incorrect present cost] i_santaToken.mint only burns 1e18 but PURCHASED_PRESENT_COST suggest cost should be 2e18. But the Extra Nice reward is also 1e18. It is not documented but if the expectation that one Extra Nice person can gift one other person than the behaviour is still maintained.
