// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.10;

import "hardhat/console.sol";

contract Domains {
    // name => owner
    mapping(string => address) public domains;

    // name => record
    mapping(string => string) public records;

    constructor() {
        console.log("DOMAINS Constructor");
    }

    /**
     * Set an address to a name
     */
    function register(string calldata name) public {
        require(
            domains[name] == address(0),
            "Name has already been registered"
        );

        domains[name] = msg.sender;
        console.log("%s has registered a domain", msg.sender);
    }

    /**
     * Get domain owner's name
     */
    function getAddress(string calldata name) public view returns (address) {
        return domains[name];
    }

    /**
     * Set a record to a name
     */
    function setRecord(string calldata name, string calldata record) public {
        require(domains[name] == msg.sender, "only owner");
        records[name] = record;
    }

    /**
     * Get record by name
     */
    function getRecord(string calldata name)
        public
        view
        returns (string memory)
    {
        return records[name];
    }
}
