// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// require to receive ERC721s from _safeTransfer()
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

// contract ContractB is ERC721Holder {
//     function deposit(uint256 tokenId) external;

//     function withdraw(uint256 tokenId) external;
// }

contract ContractA is ERC721Holder {
    IERC721 public token;

    constructor(address _token) {
        token = IERC721(_token);
    }

    ///@notice Deposit ERC721 token from sender into contract. First requires sender's approval from token.
    function deposit(uint256 tokenId) external {
        /// sender to this contract
        token.safeTransferFrom(msg.sender, address(this), tokenId);

        /// this contract to contractB
        // token.approve(address(contractB), tokenId);
        // contractB.deposit(tokenId);
    }

    ///@notice Withdraw ERC721 token from contract to sender. Direct transfer so approval not required.
    function withdraw(uint256 tokenId) external {
        /// contractB to this contract
        // contractB.withdraw(tokenId);

        /// this contract to sender
        token.safeTransferFrom(address(this), msg.sender, tokenId);
    }
}
