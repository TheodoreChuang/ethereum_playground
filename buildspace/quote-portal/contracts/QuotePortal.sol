// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

import "hardhat/console.sol";

contract QuotePortal {
    uint256 immutable prizeAmount = 0.00001 ether;
    uint256 private pseudoRandomSeed;

    uint256 totalQuotes;

    struct Quote {
        address author;
        uint256 timestamp;
        string message;
    }

    Quote[] quotes;

    mapping(address => uint256) public lastQuoteAt;

    event NewQuote(address indexed from, uint256 timestamp, string message);

    constructor() payable {
        console.log("We have been constructed!");
    }

    /**
     * Add a new quote if the last quote from author is over cooldown
     * random chance the author is rewarded
     */
    function quote(string memory _quote) public {
        console.log("quote ~ msg.sender %s", msg.sender);

        require(
            lastQuoteAt[msg.sender] + 30 seconds < block.timestamp,
            "wait 30 seconds"
        );

        lastQuoteAt[msg.sender] = block.timestamp;

        quotes.push(Quote(msg.sender, block.timestamp, _quote));

        totalQuotes += 1;

        /*
         * Generate a Psuedo random number between 0 and 99
         */
        uint256 randomNumber = (block.difficulty +
            block.timestamp +
            pseudoRandomSeed) % 100;
        console.log("Random # generated: %s", randomNumber);

        pseudoRandomSeed = randomNumber;

        if (randomNumber > 50) {
            console.log("%s won!", msg.sender);
            require(
                prizeAmount <= address(this).balance,
                "out of prize rewards"
            );
            (bool success, ) = (msg.sender).call{value: prizeAmount}("");
            require(success, "failed to withdraw from contract");
        }

        emit NewQuote(msg.sender, block.timestamp, _quote);
    }

    function getAllQuotes() public view returns (Quote[] memory) {
        return quotes;
    }

    function getTotalQuotes() public view returns (uint256) {
        console.log("getTotalQuotes ~ totalQuotes %s", totalQuotes);
        return totalQuotes;
    }
}
