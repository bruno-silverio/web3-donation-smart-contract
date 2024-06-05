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
    bool open; 
}

contract FinancialHelp {
    
    uint public lastId = 0;
    mapping(uint => Request) public requests;

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

        requests[id].balance += msg.value; // register request

        if(requests[id].balance >= requests[id].goal) closeRequest(id);
    }

    function getOpenRequests(uint startId, uint quantity) public view returns (Request[] memory) {
        
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