// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract ERC721OP is ERC721 {
    address public admin;

    constructor() ERC721("Token Name", "Token Symbol") {
        admin = msg.sender;
    }

    function mint(address to, uint256 tokenId) external {
        require(msg.sender == admin, "only admin");
        _safeMint(to, tokenId);
    }

    function faucet(address to, uint256 tokenId) external {
        _safeMint(to, tokenId);
    }
}
