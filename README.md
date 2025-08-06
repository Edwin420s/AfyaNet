# AfyaNet - Decentralized Health Records System

## Overview
AfyaNet is a Web3 health records management system that gives patients control over their medical data using blockchain technology.

## Features
- Patient-controlled medical records
- Secure IPFS storage with encryption
- Granular access permissions
- Audit trail for all access requests
- Hospital verification system

## Tech Stack
- **Blockchain**: Ethereum (Linea zkEVM)
- **Smart Contracts**: Solidity, OpenZeppelin
- **Frontend**: React, Vite, TailwindCSS
- **Backend**: Node.js, Express
- **Storage**: IPFS (Web3.Storage)
- **Wallet**: WalletConnect, MetaMask

## Setup

### Prerequisites
- Node.js 16+
- Yarn or npm
- Hardhat
- Redis (for backend caching)

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   cd afyanet
   yarn install
   cd frontend
   yarn install
   cd ../backend
   yarn install