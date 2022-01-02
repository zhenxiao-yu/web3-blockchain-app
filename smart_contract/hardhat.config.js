require("@nomiclabs/hardhat-waffle");

module.exports = {
  solidity: "0.8.0",
  networks: {
    ropsten: {
      url: "https://eth-ropsten.alchemyapi.io/v2/aTumUeJwvSAM4P2NNsWbpB2wbE2lYlj-",
      accounts: [
        "932a2cb5f993c53767541bb8d60b449087fd1e7302e22e615d1f83bdf3bb3b11",
      ],
    },
  },
};
