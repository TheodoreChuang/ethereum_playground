// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

/// @title Decentralised raffle with automated payouts
/// @author Teddy
/// @custom:credits https://github.com/PatrickAlphaC/hardhat-smartcontract-lottery-fcc/blob/typescript/contracts/Raffle.sol
contract Raffle {
    /*//////////////////////////////////////////////////////////////
                               Type declarations
    //////////////////////////////////////////////////////////////*/

    /*//////////////////////////////////////////////////////////////
                               State Variables
    //////////////////////////////////////////////////////////////*/

    uint256 private immutable i_entranceFee;

    address payable[] private s_players;

    /*//////////////////////////////////////////////////////////////
                               Events
    //////////////////////////////////////////////////////////////*/

    event RaffleEnter(address index player);

    /*//////////////////////////////////////////////////////////////
                               Error
    //////////////////////////////////////////////////////////////*/
    error Raffle__NotEnoughETHEntered();

    /*//////////////////////////////////////////////////////////////
                               CONSTRUCTOR
    //////////////////////////////////////////////////////////////*/

    constructor(uint256 entranceFee) {
        i_entranceFee = entranceFee;
    }

    /// @notice Enter the raffle by paying the required  amount
    function enterRaffle() public payable {
        if (msg.value < i_entranceFee) {
            revert Raffle__NotEnoughETHEntered();
        }

        s_players.push(payable(msg.sender));

        emit RaffleEnter(msg.sender);
    }

    // Pick a random winner (on-chain verifiably random)
    // Winner to be selected automatically on a regular frequency

    function getEntranceFee() public view returns (uint256) {
        return i_entranceFee;
    }

    function getPlayer(uint256 index) public view returns (address) {
        return s_players[index];
    }
}
