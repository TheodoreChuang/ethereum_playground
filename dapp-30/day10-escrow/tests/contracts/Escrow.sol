// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Escrow {
    address public payer;
    address payable public payee;
    address public lawyer;
    uint256 public amount;

    constructor(
        address _payer,
        address payable _payee,
        uint256 _amount
    ) {
        payer = _payer;
        payee = _payee;
        amount = _amount;
        lawyer = msg.sender;
    }

    function deposit() public payable {
        require(msg.sender == payer, "Only the payer can deposit funds");
        require(address(this).balance <= amount, "Total value exceeds amount");
    }

    function release() public {
        require(msg.sender == lawyer, "Only lawyer can release funds");
        require(address(this).balance == amount, "Not fully funded yet");

        payee.transfer(amount);
    }

    function balanceOf() public view returns (uint256) {
        return address(this).balance;
    }
}
