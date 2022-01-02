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
  const [currentAccount, setCurrentAccount] = useState();
  const [formData, setFormData] = useState({
    addressTo: "",
    amount: "",
    keyword: "",
    message: "",
  });

  //handle input (form) change
  const handleChange = (e, name) => {
    setFormData((prevState) => ({ ...prevState, [name]: e.target.value }));
  };

  // check if wallet (metamask) is connected
  const checkIfWalletIsConnect = async () => {
    try {
      // check for metamask existence
      if (!ethereum) return alert("Please install MetaMask first");
      // request and get accounts
      const accounts = await ethereum.request({ method: "eth_accounts" });
      if (accounts.length) {
        //set current account as the first account in array
        setCurrentAccount(accounts[0]);
        // getAllTransactions();
      } else {
        console.log("No accounts detected");
      }
    } catch (error) {
      // error handling
      console.log(error);
    }
  };

  // connect to a metamask wallet
  const connectWallet = async () => {
    try {
      // check for metamask existence
      if (!ethereum) return alert("Please install MetaMask first");
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      //set current account as the first account in array
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
      throw new Error("No ethereum object");
    }
  };

  const sendTransaction = async () => {
    try {
      // check for metamask existence
      if (!ethereum) return alert("Please install MetaMask first");
    } catch (error) {
      console.log(error);

      throw new Error("No ethereum object");
    }
  };

  useEffect(() => {
    checkIfWalletIsConnect();
  }, []);

  return (
    // passing connectWallet to all of the components
    <TransactionContext.Provider
      value={{
        connectWallet,
        currentAccount,
        formData,
        setFormData,
        handleChange,
        sendTransaction
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
