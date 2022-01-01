// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0; 

contract Transactions {
    // holds the number of transactions
    uint256 transactionsCount;

    //function event 
    event Transfer(address from, address receiver, uint amount, string message, uint256 timestamp, string keyword);

    //object (structure) to be transfered
    struct TransferStruct {
        address sender;
        address receiver;
        uint amount;
        string message;
        uint256 timestamp;
        string keyword;
    }

    //array of transactions (transfer objects)
    TransferStruct[] transactions;


    function addToBlockchain(address payable receiver, uint amount, string memory message, string memory keyword) public {
        // increase transaction count by 1
        transactionsCount += 1;
        // add transaction to list of all transactions
        transactions.push(TransferStruct(msg.sender, receiver, amount, message, block.timestamp, keyword));
        // start transfer
        emit Transfer(msg.sender, receiver, amount, message, block.timestamp, keyword);

    }

    //returns an array of transfer structure (transactions)
    function getAllTranscations() public view returns (TransferStruct[] memory){
        return transactions;
    }
    
    //return the number of transactions
    function getTransactionCount() public view returns (uint256) {
        return transactionsCount;
    }

}
