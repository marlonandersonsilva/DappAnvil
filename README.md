# Anvil Blockchain DApp

A decentralized application built with React, Ethers.js, and Anvil (Foundry's local Ethereum development environment).

## Features

- Connect to MetaMask wallet
- View token balances
- Transfer tokens between accounts
- View transaction history
- Real-time transaction status updates

## Prerequisites

- [Node.js](https://nodejs.org/) (v16 or later)
- [MetaMask](https://metamask.io/download.html) browser extension
- [Foundry](https://book.getfoundry.sh/getting-started/installation.html) for Anvil

## Setup Instructions

1. Install dependencies:

```bash
npm install
```

2. Start the Anvil local blockchain in a separate terminal:

```bash
npm run start-anvil
```

3. Deploy the token contract to the local Anvil blockchain:

```bash
npm run deploy-contract
```

4. Start the development server:

```bash
npm run dev
```

5. Configure MetaMask to connect to the local Anvil blockchain:
   - Network Name: Anvil
   - RPC URL: http://127.0.0.1:8545
   - Chain ID: 31337
   - Currency Symbol: ETH

6. Import a test account to MetaMask using one of the private keys provided by Anvil when it starts.

## Smart Contract

The project includes a simple ERC-20 token contract (`Token.sol`) that allows for:
- Checking balances
- Transferring tokens
- Approving and transferring tokens on behalf of others

## Development

- `contracts/` - Contains Solidity smart contracts
- `src/` - React application source code
- `scripts/` - Deployment and utility scripts

## License

MIT