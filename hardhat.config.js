require("@nomiclabs/hardhat-waffle");

// The next line is part of the sample project, you don't need it in your
// project. It imports a Hardhat task definition, that can be used for
// testing the frontend.
require("./tasks/faucet");

require("@nomiclabs/hardhat-waffle");


// If you are using MetaMask, be sure to change the chainId to 1337
module.exports = {
  solidity: "0.8.2",
  networks: {
    hardhat: {
      chainId: 31337
    },
    goerli: {
      url: `https://eth-goerli.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
      accounts: [`${GOERLI_PRIVATE_KEY}`]
    }
  }
};
