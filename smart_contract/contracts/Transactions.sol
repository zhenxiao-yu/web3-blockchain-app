// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0; 

contract Transactions {
    // holds the number of transactions
    uint256 transactionsCounter;

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

    function addToBlockchain() public {

    }

    function getAllTranscations() public {

    }


    function addToBlockchain() public {

    }
}
