// SPDX-License-Identifier: MIT

pragma solidity ^0.8.24;

struct Request {
    uint id;
    address author; // address wallet
    string title;
    string description;
    string contact;
    uint timestamp; // seconds since 1970
    uint goal; // wei -> 1 ETH = 1 * 10 ^ 18 wei
    uint balance;
    uint donationsCount;
    bool open; 
}

contract FinancialHelp {
    
    address admin;
    uint public lastId = 0;
    mapping(uint => Request) public requests;

    constructor() {
        admin = msg.sender;
    }

    function openRequest(string memory title, string memory description, string memory contact, uint goal) public {
        
        lastId++;

        requests[lastId] = Request({
            id: lastId,
            title: title,
            description: description,
            contact: contact,
            goal: goal,
            balance: 0,
            timestamp: block.timestamp,
            author: msg.sender, //address wallet
            donationsCount: 0,
            open: true
        });
    }

    function closeRequest(uint id) public {

        address author = requests[id].author;
        uint balance = requests[id].balance;
        uint goal = requests[id].goal;

        require(requests[id].open && (msg.sender == author || balance >= goal), "Access denied");

        requests[id].open = false;

        if(balance > 0) {
            requests[id].balance = 0;
            payable(author).transfer(balance);
        }
    }

    function donate(uint id) public payable {

        require(msg.value > 0, "Invalid operation"); // Donation cannot be less than zero
        require(requests[id].open == false, "Campaign ended"); // Unable to donate to closed campaigns

        requests[id].balance += msg.value; // register request
        requests[id].donationsCount++;

        if(requests[id].balance >= requests[id].goal) closeRequest(id);
    }

    function getOpenRequests(uint startId, uint quantity) public view returns (Request[] memory) {
        
        require(startId > 0, "Invalid startId");
        require(quantity > 0 && quantity < 20, "Invalid quantity");

        uint id = startId;
        uint count = 0;
        Request[] memory result = new Request[](quantity);

        do {
            if(requests[id].open) {
                result[count] = requests[id];
                count++;
            }

            id++;
        }
        while(count < quantity && id <= lastId);

        return result;
    }
}