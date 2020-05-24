pragma solidity >=0.6.0 <0.7.0;


contract SimpleStorage {
    string public message;

    constructor(string memory _message) public {
        message = _message;
    }

    function setMessage(string memory _message) public {
        message = _message;
    }
}
