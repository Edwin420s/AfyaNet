require('@nomicfoundation/hardhat-toolbox');
require('dotenv').config();

module.exports = {
  solidity: "0.8.18",
  networks: {
    linea_testnet: {
      url: process.env.LINEA_TESTNET_RPC,
      accounts: [process.env.DEPLOYER_PRIVATE_KEY]
    },
    localhost: {
      url: "http://127.0.0.1:8545"
    }
  },
  etherscan: {
    apiKey: {
      linea_testnet: process.env.LINEASCAN_API_KEY
    }
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS === 'true',
    currency: 'USD'
  }
};