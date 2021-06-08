// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

///@notice consumer of ContractA
interface ContractB {
    function deposit(uint256 amount) external;

    function withdraw(uint256 amount) external;
}

///@notice consumer of ERC20
contract ContractA {
    IERC20 public token;
    ContractB public contractB;

    constructor(address _token, address _contractB) {
        token = IERC20(_token);
        contractB = ContractB(_contractB);
    }

    ///@notice Deposit token from sender to ContractB. First requires sender's approval from token.
    function deposit(uint256 amount) external {
        /// sender to this contract
        token.transferFrom(msg.sender, address(this), amount);

        /// this contract to contractB
        token.approve(address(contractB), amount);
        contractB.deposit(amount);
    }

    ///@notice Withdraw token from ContractB to sender
    function withdraw(uint256 amount) external {
        /// contractB to this contract
        contractB.withdraw(amount);

        /// this contract to sender
        token.transfer(msg.sender, amount);
    }
}
