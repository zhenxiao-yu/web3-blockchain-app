const main = async () => {
 
  //factory that generates instances of the Transactions contract
  const Transactions = await hre.ethers.getContractFactory("Transactions");
  // 1 stance of Transactions, transactions
  const transactions = await Transactions.deploy();

  //wait for transactions to be deployed
  await transactions.deployed();

  console.log("Transactions deployed to:", transactions.address);
}

// async method to run main 
const runMain = async () => {
  try {
    await main();
    // exit code 0 after successfully running main
    process.exit(0);
  } catch (error) {
    console.error(error);
    // exit code 1 after an error has occurred
    process.exit(1)
  }
}

runMain();