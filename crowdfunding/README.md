# Crowdfunding

Decentralized crowdfunding platform.

- Create your campaign.
- Receive contributions.
- The campaign owner will need to create request to spend any funds.
- A minimum number of Contributors will need to approve a request before any funds can be sent.
- ¿Some way to close the campaign and refund any remaining contributions?

## Smart Contracts

Campaign Factory deployed on Rinkeby at: 0x7E8719ccD5cE88fB719A668C1C1Db757E911d60B

## Client App

Why Next.js? Because our users may not be using MetaMask but we still want them to be able to interactive with the app. Using server side rendering with Next.js we will prefetch campaign data from the Ethereum network.

[![](https://mermaid.ink/img/eyJjb2RlIjoiZ3JhcGggVERcbiAgQVtTb3VyY2UgQ29kZV0gLS0-IEJbTmV4dC5qcyBTZXJ2ZXJdXG4gIEIgLS0-IHxxdWVyeSBkYXRhfCBDW0V0aGVyZXVtIE5ldHdvcmtdXG4gIEIgLS0-IERbSFRNTF1cbiAgRCAtLT4gRVtKU11cbiAgRCAtLT4gRltCcm93c2VyXVx0XG4gIEUgLS0-IEZbQnJvd3Nlcl1cdCIsIm1lcm1haWQiOnsidGhlbWUiOiJkZWZhdWx0In0sInVwZGF0ZUVkaXRvciI6ZmFsc2V9)](https://mermaid-js.github.io/mermaid-live-editor/#/edit/eyJjb2RlIjoiZ3JhcGggVERcbiAgQVtTb3VyY2UgQ29kZV0gLS0-IEJbTmV4dC5qcyBTZXJ2ZXJdXG4gIEIgLS0-IHxxdWVyeSBkYXRhfCBDW0V0aGVyZXVtIE5ldHdvcmtdXG4gIEIgLS0-IERbSFRNTF1cbiAgRCAtLT4gRVtKU11cbiAgRCAtLT4gRltCcm93c2VyXVx0XG4gIEUgLS0-IEZbQnJvd3Nlcl1cdCIsIm1lcm1haWQiOnsidGhlbWUiOiJkZWZhdWx0In0sInVwZGF0ZUVkaXRvciI6ZmFsc2V9)

## Future Enhancements:

- A way to inactive a campaign and no longer accept contributions, etc. (hard or soft?)
  - A way to proportionally refund any remaining funds
- Should it handle insufficient funds to finalizes a Request? currently fails and reverts
