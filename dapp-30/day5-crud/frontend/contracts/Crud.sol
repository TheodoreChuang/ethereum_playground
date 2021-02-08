// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Crud {
    struct User {
        uint256 id;
        string name;
    }
    User[] public users;
    /// @dev start nextId to avoid false positive with 0
    uint256 public nextId = 1;

    /// @notice Create a new user
    function userCreate(string memory name) public {
        users.push(User(nextId, name));
        nextId++;
    }

    /// @notice Get a user's details
    function userRead(uint256 id)
        public
        view
        returns (uint256 _id, string memory _name)
    {
        uint256 index = findIndex(id);
        return (users[index].id, users[index].name);
    }

    /// @notice Update an existing user
    function userUpdate(uint256 id, string memory name) public {
        uint256 index = findIndex(id);
        users[index].name = name;
    }

    /// @notice Destroy an existing user
    /// @dev id filled with default values, id are not rerranged
    function userDestroy(uint256 id) public {
        uint256 index = findIndex(id);
        delete users[index];
    }

    /// @notice Util: Find an user index by its id
    function findIndex(uint256 id) internal view returns (uint256 index) {
        for (uint256 i = 0; i < users.length; i++) {
            if (users[i].id == id) {
                return i;
            }
        }
        revert("User does not exist");
    }
}
