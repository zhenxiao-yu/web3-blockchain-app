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

  //   test
  //   console.log({
  //     provider,
  //     signer,
  //     transactionContract,
  //   });

  return transactionContract;
};

export const TransactionsProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState();
  const [formData, setFormData] = useState({
    addressTo: "",
    amount: "",
    keyword: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  // store transactionCount in local storage
  const [transactionCount, setTransactionCount] = useState(localStorage.getItem("transactionCount"));

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

  //send transaction method
  const sendTransaction = async () => {
    try {
      // check for metamask existence
      if (!ethereum) return alert("Please install MetaMask first");

      //destructure formData
      const { addressTo, amount, keyword, message } = formData;
      // store contract in variable
      const transactionContract = getEthereumContract();
      //convert from amount to unit into Gwei
      const parsedAmount = ethers.utils.parseEther(amount);

      await ethereum.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: currentAccount,
            to: addressTo,
            gas: "2BF20", // 180000 gwei == 0.00018 ether
            value: parsedAmount._hex, //0.00001
          },
        ],
      });

      // await for transaction to be added to the blockchain
      const transactionHash = await transactionContract.addToBlockchain(
        addressTo,
        parsedAmount,
        message,
        keyword
      );

      setIsLoading(true); //start loading
      console.log(`Loading - ${transactionHash.hash}`);
      await transactionHash.wait(); //wait for transaction to finish
      setIsLoading(false); //finish loading
      console.log(`Success - ${transactionHash.hash}`);
      //get total number of transactions
      const transactionCount = await transactionContract.getTransactionCount();
      setTransactionCount(transactionCount.toNumber());
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
        sendTransaction,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
