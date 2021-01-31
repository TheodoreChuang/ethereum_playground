// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/// @notice Storage of an array of numbers
contract AdvancedStorage {
    uint256[] public ids;

    function add(uint256 id) public {
        ids.push(id);
    }

    function get(uint256 i) public view returns (uint256) {
        return ids[i];
    }

    function getAll() public view returns (uint256[] memory) {
        return ids;
    }

    function length() public view returns (uint256) {
        return ids.length;
    }
}
