import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

import { contractABI, contractAddress } from "../utils/constants";

// export context
export const TransactionContext = React.createContext();

//destructure ethereum object from window.ethereum
const { ethereum } = window;

//get the ethereum contract
const createEthereumContract = () => {
  // provider and signer
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  // get the transaction contract
  const transactionsContract = new ethers.Contract(
    contractAddress,
    contractABI,
    signer
  );

    console.log({
      provider,
      signer,
      transactionsContract,
    });

  return transactionsContract;
};

export const TransactionsProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [formData, setformData] = useState({
    addressTo: "",
    amount: "",
    keyword: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  // store transactionCount in local storage
  const [transactionCount, setTransactionCount] = useState(
    localStorage.getItem("transactionCount")
  );
  const [transactions, setTransactions] = useState([]);

  //handle input (form) change
  const handleChange = (e, name) => {
    setformData((prevState) => ({ ...prevState, [name]: e.target.value }));
  };

  // get all transactions
  const getAllTransactions = async () => {
    try {
      if (ethereum) {
        // get contract
        const transactionsContract = createEthereumContract();

        const availableTransactions =
          await transactionsContract.getAllTransactions();
        // new structure for transactions
        const structuredTransactions = availableTransactions.map(
          (transaction) => ({
            addressTo: transaction.receiver,
            addressFrom: transaction.sender,
            timestamp: new Date(
              transaction.timestamp.toNumber() * 1000
            ).toLocaleString(),
            message: transaction.message,
            keyword: transaction.keyword,
            amount: parseInt(transaction.amount._hex) / 10 ** 18,
          })
        );

        console.log(structuredTransactions);

        setTransactions(structuredTransactions);
      } else {
        console.log("Ethereum is not present");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // check if wallet (metamask) is connected
  const checkIfWalletIsConnect = async () => {
    try {
      // check for metamask existence
      if (!ethereum) return alert("Please install MetaMask first.");
      // request and get accounts
      const accounts = await ethereum.request({ method: "eth_accounts" });
      if (accounts.length) {
        //set current account as the first account in array
        setCurrentAccount(accounts[0]);
        getAllTransactions();
      } else {
        console.log("No accounts found");
      }
    } catch (error) {
      // error handling
      console.log(error);
    }
  };

  // check for Transaction existence
  const checkIfTransactionsExists = async () => {
    try {
      if (ethereum) {
        const transactionsContract = createEthereumContract();
        const currentTransactionCount =
          await transactionsContract.getTransactionCount();
        // set transaction count in local storage
        window.localStorage.setItem(
          "transactionCount",
          currentTransactionCount
        );
      }
    } catch (error) {
      console.log(error);

      throw new Error("No ethereum object");
    }
  };

  // connect to a metamask wallet
  const connectWallet = async () => {
    try {
      // check for metamask existence
      if (!ethereum) return alert("Please install MetaMask first.");

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
      if (ethereum) {
        //destructure formData
        const { addressTo, amount, keyword, message } = formData;
        // store contract in variable
        const transactionsContract = createEthereumContract();
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
        const transactionHash = await transactionsContract.addToBlockchain(
          addressTo,
          parsedAmount,
          message,
          keyword
        );

        setIsLoading(true); //start loading
        console.log(`Loading - ${transactionHash.hash}`);
        await transactionHash.wait(); //wait for transaction to finish
        console.log(`Success - ${transactionHash.hash}`);
        setIsLoading(false); //finish loading

        //get total number of transactions
        const transactionsCount =
          await transactionsContract.getTransactionCount();

        setTransactionCount(transactionsCount.toNumber());
      } else {
        console.log("No ethereum object");
      }
    } catch (error) {
      console.log(error);
      throw new Error("No ethereum object");
    }
  };

  useEffect(() => {
    checkIfWalletIsConnect();
    checkIfTransactionsExists();
  }, [transactionCount]);

  return (
    // passing to all the other components
    <TransactionContext.Provider
      value={{
        transactionCount,
        connectWallet,
        transactions,
        currentAccount,
        isLoading,
        sendTransaction,
        handleChange,
        formData,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
