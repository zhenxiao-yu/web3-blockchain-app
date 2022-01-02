import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

import { contractABI, contractAddress } from "../utils/constants";

// export context
export const TransactionContext = React.createContext();

//destructure ethereum object from window.ethereum
const { ethereum } = window;

//get the ethereum contract
const getEthereumContract = () => {
  // provider and signer
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  // get the transaction contract
  const transactionContract = new ethers.Contract(
    contractAddress,
    contractABI,
    signer
  );

  console.log({
    provider,
    signer,
    transactionContract,
  });
};

export const TransactionsProvider = ({ children }) => {
  return (
    <TransactionContext.Provider value={{}}>
      {children}
    </TransactionContext.Provider>
  );
};
