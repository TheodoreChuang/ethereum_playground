# Crowdfunding

Decentralized crowdfunding platform.

- Create your campaign.
- Receive contributions.
- The campaign owner will need to create request to spend any funds.
- A minimum number of Contributors will need to approve a request before any funds can be sent.
- ¿Some way to close the campaign and refund any remaining contributions?

## Smart Contracts

Campaign Factory v1 deployed on Rinkeby at: 0x7E8719ccD5cE88fB719A668C1C1Db757E911d60B
Campaign Factory v2 deployed on Rinkeby at: 0xBe2277a1F01F08aA6909B72653aA92d9D80e551f

- adding getSummary(), getRequestsCount()

## Client App

Why Next.js? Because our users may not be using MetaMask but we still want them to be able to interactive with the app. Using server side rendering with Next.js we will prefetch campaign data from the Ethereum network.

[![](https://mermaid.ink/img/eyJjb2RlIjoiZ3JhcGggVERcbiAgQVtTb3VyY2UgQ29kZV0gLS0-IEJbTmV4dC5qcyBTZXJ2ZXJdXG4gIEIgLS0-IHxnZXRJbml0aWFsUHJvcHN8IENbRXRoZXJldW0gTmV0d29ya11cbiAgQyAtLT4gfGluaXRpYWwgZGF0YXwgQlxuICBCIC0tPiBEW0hUTUxdXG4gIEIgLS0-IHxiaXQgbGF0ZXJ8IEVbSlNdXG4gIEQgLS0-IEZbQnJvd3Nlcl1cdFxuICBFIC0tPiBGW0Jyb3dzZXJdXHQiLCJtZXJtYWlkIjp7InRoZW1lIjoiZGVmYXVsdCJ9LCJ1cGRhdGVFZGl0b3IiOmZhbHNlfQ)](https://mermaid-js.github.io/mermaid-live-editor/#/edit/eyJjb2RlIjoiZ3JhcGggVERcbiAgQVtTb3VyY2UgQ29kZV0gLS0-IEJbTmV4dC5qcyBTZXJ2ZXJdXG4gIEIgLS0-IHxnZXRJbml0aWFsUHJvcHN8IENbRXRoZXJldW0gTmV0d29ya11cbiAgQyAtLT4gfGluaXRpYWwgZGF0YXwgQlxuICBCIC0tPiBEW0hUTUxdXG4gIEIgLS0-IHxiaXQgbGF0ZXJ8IEVbSlNdXG4gIEQgLS0-IEZbQnJvd3Nlcl1cdFxuICBFIC0tPiBGW0Jyb3dzZXJdXHQiLCJtZXJtYWlkIjp7InRoZW1lIjoiZGVmYXVsdCJ9LCJ1cGRhdGVFZGl0b3IiOmZhbHNlfQ)

## Future Enhancements:

- A way to inactive a campaign and no longer accept contributions, etc. (hard or soft?)
  - A way to proportionally refund any remaining funds
- Should it handle insufficient funds to finalizes a Request? currently fails and reverts

### Dev

```bash
npm install --save-dev eslint eslint-config-prettier eslint-plugin-prettier eslint-plugin-react eslint-plugin-react-hooks prettier husky lint-staged
npm i prop-types
```

PropTypes:
https://blog.logrocket.com/validating-react-component-props-with-prop-types-ef14b29963fc/
