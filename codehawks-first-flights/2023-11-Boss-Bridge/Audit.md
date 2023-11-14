## Goals

Grasp high level functionality.

- What the initial set up?
  - One bridge per chain.
  - One token per chain?
  - One vault per token?
- Bridge only manages a ERC20 token which the protocol creates.
  - Q: How do users get tokens?
    - A: Token deployer does but unable to determine flow. Not an issue.
- Deposit flow:
  - User needs to approve the bridge to transfer before depositing.

## Notes

## Findings

- @audit-issue [depositTokensToL2-theftViaDeposit]
